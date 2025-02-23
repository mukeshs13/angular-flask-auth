import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemService {
  private baseUrl = 'http://localhost:5000/items'; // Flask API

  constructor(private http: HttpClient) {}

  private getAuthHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
  }

  getItems(): Observable<any> {
    return this.http.get(this.baseUrl, { headers: this.getAuthHeaders() });
  }

  addItem(newItem: any): Observable<any> {
    return this.http.post(this.baseUrl, newItem, { headers: this.getAuthHeaders() });
  }

  updateItem(itemId: number, updatedItem: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${itemId}`, updatedItem, { headers: this.getAuthHeaders() });
  }

  deleteItem(itemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${itemId}`, { headers: this.getAuthHeaders() });
  }
}
