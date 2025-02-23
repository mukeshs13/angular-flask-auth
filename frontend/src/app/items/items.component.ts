import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-items',
  standalone: true,
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  imports: [CommonModule, FormsModule, HttpClientModule]  // ✅ Import HttpClientModule
})
export class ItemsComponent {
  username: string = localStorage.getItem('username') || '';
  token: string | null = localStorage.getItem('token');
  items: any[] = [];
  newItem = { name: '', description: '' };
  editedItem = { id: null, name: '', description: '' };
  editingIndex: number | null = null;

  constructor(private http: HttpClient, private router: Router) {
    if (!this.token) {
      alert("Please log in first!");
      this.router.navigate(['/login']);
    } else {
      this.fetchItems();
    }
  }

  async fetchItems() {
    if (!this.token || !this.username) {
      alert("Authentication error! Please log in.");
      this.router.navigate(['/login']);
      return;
    }

    try {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });

      const response: any = await this.http
        .get(`http://127.0.0.1:5000/items/${this.username}`, { headers })
        .toPromise();

      this.items = response;
    } catch (error) {
      console.error("Error fetching items:", error);
      alert("Failed to load items!");
    }
  }

  async addItem() {
    if (!this.token) {
      alert("Session expired! Please log in again.");
      this.router.navigate(['/login']);
      return;
    }

    if (!this.newItem.name.trim() || !this.newItem.description.trim()) {
      alert("Item name and description cannot be empty!");
      return;
    }

    try {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });

      const response: any = await this.http
        .post('http://127.0.0.1:5000/items',
          { username: this.username, name: this.newItem.name, description: this.newItem.description },
          { headers }
        )
        .toPromise();

      this.items.push(response);
      this.newItem = { name: '', description: '' };
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Failed to add item!");
    }
  }

  editItem(item: any, index: number) {
    this.editedItem = { ...item };
    this.editingIndex = index;
  }

  async updateItem() {
    if (!this.token) {
      alert("Session expired! Please log in again.");
      this.router.navigate(['/login']);
      return;
    }

    if (this.editingIndex === null) return;

    try {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });

      await this.http
        .put(`http://127.0.0.1:5000/items/${this.editedItem.id}`, this.editedItem, { headers })
        .toPromise();

      this.items[this.editingIndex] = { ...this.editedItem };
      this.editedItem = { id: null, name: '', description: '' };
      this.editingIndex = null;
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Failed to update item!");
    }
  }

  async deleteItem(item: any) {
    if (!this.token) {
      alert("Session expired! Please log in again.");
      this.router.navigate(['/login']);
      return;
    }

    try {
      const headers = new HttpHeaders({ 'Authorization': `Bearer ${this.token}` });

      await this.http
        .delete(`http://127.0.0.1:5000/items/${item.id}`, { headers })
        .toPromise();

      this.items = this.items.filter(i => i.id !== item.id);
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item!");
    }
  }
}
