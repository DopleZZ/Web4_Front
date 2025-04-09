import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  error: string = '';
  API_URL = 'http://localhost:8080/backend_war/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string): Promise<any> {
    return firstValueFrom(
      this.http.post<any>(`${this.API_URL}/users/login`, { username, password }, { withCredentials: true }).pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
        })
      )
    );
  }

  register(username: string, password: string): Promise<any> {
    return firstValueFrom(
      this.http.post<any>(`${this.API_URL}/users/register`, { username, password }, { withCredentials: true }).pipe(
        tap(response => {
          // Обработка успешной регистрации
        })
      )
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }
}
