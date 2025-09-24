import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'http://127.0.0.1:8000/'; 

  constructor(private http: HttpClient) {}
  // Add this method to ApiService
 register(username: string, email: string, password: string) {
    return this.http.post(`${this.BASE_URL}api/auth/register/`, { username, email, password });
  }



login(username: string, password: string) {
  return this.http.post(`${this.BASE_URL}api/auth/login/`, { username, password });
}


  // Example: Get active users
  getActiveUsers(): Observable<any> {
    return this.http.get(`${this.BASE_URL}users/active/`);
  }

  // Example: Get packages
  getPackages(): Observable<any> {
    return this.http.get(`${this.BASE_URL}packages/`);
  }

  // Example: Get performance indexes
  getPerformance(): Observable<any> {
    return this.http.get(`${this.BASE_URL}performance/`);
  }

  // Example: Post Mikrotik reset
  resetMikrotik(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}mikrotik/reset/`, data);
  }

  // Example: Get SMS subscriptions
  getSmsSubscriptions(): Observable<any> {
    return this.http.get(`${this.BASE_URL}sms/subscriptions/`);
  }

}