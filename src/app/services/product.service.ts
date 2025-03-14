import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';

const baseUrl = 'https://localhost:44312/api/Products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) { }

  getAll(): Observable<{ data: { data: Product[] } }> {
    return this.http.get<{ data: { data: Product[] } }>(baseUrl);
  }
}
