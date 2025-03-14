import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../models/user.model';

const baseUrl = 'https://localhost:44312/api/Users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) { }

  getUserByEmail(email: string): Observable<User> {
    return this.http.post<{ data: User }>(`${baseUrl}/GetUserByEmail`, { email })
      .pipe(map(response => response.data));
  }
}
