import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsername(): string | null {
    return localStorage.getItem('username');
  }

  async register(username: string, password: string) {
    try {
      const response: any = await this.http.post(`${this.baseUrl}/register`, {
        username,
        password
      }).toPromise();

      return response;
    } catch (error) {
      throw error;
    }
  }

  async login(username: string, password: string) {
    try {
      const response: any = await this.http.post(`${this.baseUrl}/login`, {
        username,
        password
      }).toPromise();

      if (response.status === 'success') {
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', username);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
