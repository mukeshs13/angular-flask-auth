import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:5000'; // Flask API URL

  constructor(private http: HttpClient) {}

  login(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, user, { withCredentials: true });
  }

  register(user: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  getItems(): Observable<any> {  // No need to pass username
    return this.http.get(`${this.baseUrl}/items`, { withCredentials: true });
  }

  addItem(item: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/item`, item, { withCredentials: true }); // Corrected path
  }

  editItem(id: number, item: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/item/${id}`, item, { withCredentials: true }); // Corrected path
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/item/${id}`, { withCredentials: true }); // Corrected path
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/logout`, {}, { withCredentials: true });
  }
}
