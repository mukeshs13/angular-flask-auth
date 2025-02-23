import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // ✅ Import HttpClient
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: []
})
export class RegisterComponent {
  username: string = '';
  password: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  handleUsername(event: Event) {
    this.username = (event.target as HTMLInputElement).value;
  }

  handlePassword(event: Event) {
    this.password = (event.target as HTMLInputElement).value;
  }

  registerUser() {
    if (!this.username || !this.password) {
      alert('Please enter a username and password');
      return;
    }

    // ✅ Send data to Flask backend instead of storing it in localStorage
    this.http.post('http://localhost:5000/register', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        alert('User Registered Successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error.message || 'Registration Failed');
      }
    });
  }
}
