import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private API_URL = 'http://localhost:8080/backend_war/api';

  constructor(private http: HttpClient) {}

  getPoints(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.get<any[]>(`${this.API_URL}/points`, { headers });
  }

  submitPoint(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + localStorage.getItem('token')
    });
    return this.http.post<any>(`${this.API_URL}/points`, data, { headers });
  }
}
