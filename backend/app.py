from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

app = Flask(__name__)

# ✅ Allow only frontend requests from localhost:4200
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

# ✅ Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your_secret_key'  # Change this to a strong secret key
db = SQLAlchemy(app)


# ✅ User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)  # Hashed password
    items = db.relationship('Item', backref='user', lazy=True)


# ✅ Item model (Foreign Key to User.id)
class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    username = db.Column(db.String(80), nullable=False)  # ✅ Kept the username field
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=False)


# ✅ Create database tables
with app.app_context():
    db.create_all()


# ✅ Middleware to check JWT authentication
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"status": "error", "message": "Token is missing!"}), 401

        try:
            token = token.split(" ")[1]  # Remove "Bearer "
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.get(data["user_id"])
            if not current_user:
                return jsonify({"status": "error", "message": "Invalid token!"}), 401
        except Exception as e:
            return jsonify({"status": "error", "message": "Invalid token!"}), 401

        return f(current_user, *args, **kwargs)

    return decorated


# ✅ Register a user
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"status": "error", "message": "Missing username or password"}), 400

    existing_user = User.query.filter_by(username=data['username']).first()
    if existing_user:
        return jsonify({"status": "error", "message": "User already exists"}), 400

    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(username=data['username'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"status": "success", "message": "User registered successfully"}), 201


# ✅ Login user (JWT Token-based)
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({"status": "error", "message": "Missing username or password"}), 400

    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password, data['password']):
        token = jwt.encode(
            {"user_id": user.id, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
            app.config['SECRET_KEY'],
            algorithm="HS256"
        )
        return jsonify({"status": "success", "message": "Login successful", "token": token}), 200

    return jsonify({"status": "error", "message": "Invalid username or password"}), 401


# ✅ Get all users (for debugging)
@app.route('/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{"id": user.id, "username": user.username} for user in users])


# ✅ Get items for a specific user (JWT Protected)
@app.route('/items/<username>', methods=['GET'])
@token_required
def get_items(current_user, username):
    if current_user.username != username:
        return jsonify({"status": "error", "message": "Unauthorized access"}), 403

    items = Item.query.filter_by(user_id=current_user.id).all()
    return jsonify([
        {"id": item.id, "name": item.name, "description": item.description}
        for item in items
    ])


# ✅ Add a new item (JWT Protected)
@app.route('/items', methods=['POST'])
@token_required
def add_item(current_user):
    data = request.json
    if not data or not data.get('name') or not data.get('description'):
        return jsonify({'status': 'error', 'message': 'Invalid data'}), 400

    new_item = Item(user_id=current_user.id, username=current_user.username, name=data['name'],
                    description=data['description'])
    db.session.add(new_item)
    db.session.commit()

    return jsonify({
        'status': 'success',
        'message': 'Item added successfully',
        'id': new_item.id,
        'username': new_item.username,
        'name': new_item.name,
        'description': new_item.description
    }), 201


# ✅ Run Flask app
if __name__ == '__main__':
    app.run(debug=True)
