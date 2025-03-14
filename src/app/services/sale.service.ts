import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'https://localhost:44312/api/Sales';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  constructor(private http: HttpClient) { }

  getSales(): Observable<any> {
    return this.http.get<any>(baseUrl);
  }

  createSale(sale: any): Observable<any> {
    return this.http.post<any>(baseUrl, sale);
  }
}
