import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true, // ✅ Standalone component
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule] // ✅ Import required modules
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  handleUsername(event: Event) {
    this.username = (event.target as HTMLInputElement).value;
  }

  handlePassword(event: Event) {
    this.password = (event.target as HTMLInputElement).value;
  }

  loginUser() {
    const loginData = { username: this.username, password: this.password };

    fetch('http://127.0.0.1:5000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        localStorage.setItem('token', data.token); // ✅ Store token, not password
        localStorage.setItem('username', this.username);
        alert('Login Successful');
        this.router.navigate(['/items']);
      } else {
        alert('Invalid Username or Password');
        this.router.navigate(['/register']);
      }
    })
    .catch(error => {
      console.error("Login error:", error);
      alert("An error occurred. Please try again.");
    });
  }
}
