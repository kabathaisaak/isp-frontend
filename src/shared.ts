import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ============================
// Interfaces
// ============================
export interface Customer {
  id: string;
  name?: string;
  ipAddress: string;
  plan: string;
  mikrotik: string;
  amount: number;
  expiry: string;
}

export interface Voucher {
  id: string;
  code: string;
  userId?: string;
  amount: number;
  expiry: string;
  used: boolean;
}

export interface HotspotPlan {
  id: string;
  name: string;
  price: number;
  trialDays?: number;
  autoOn?: boolean;
  purchasersCount?: number;
}

// ============================
// Service
// ============================
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  getCustomers() {
    throw new Error('Method not implemented.');
  }
  private BASE_URL = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) {}

  // ============================
  // AUTH
  // ============================
  register(username: string, email: string, password: string) {
    return this.http.post(`${this.BASE_URL}api/auth/register/`, { username, email, password });
  }

  login(username: string, password: string) {
    return this.http.post(`${this.BASE_URL}api/auth/login/`, { username, password });
  }

  // ============================
  // CUSTOMERS
  // ============================
  /** Get all active customers */
  getActiveCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.BASE_URL}api/customers/active/`);
  }

  /** Get single customer with full details */
  getCustomerDetails(customerId: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.BASE_URL}api/customers/${customerId}/`);
  }

  /** Fetch session details of a customer's device from Mikrotik */
  fetchDeviceSessionDetails(mikrotikId: string, customerIp: string) {
    return this.http.get(
      `${this.BASE_URL}api/mikrotiks/${mikrotikId}/session/?ip=${encodeURIComponent(customerIp)}`
    );
  }

  // ============================
  // VOUCHERS
  // ============================
  /** Get vouchers that are close to expiry */
  getExpiringVouchers(): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(`${this.BASE_URL}api/vouchers/expiring/`);
  }

  /** Create a new voucher for a user */
  createVoucher(payload: { amount: number; expiry: string; userId?: string }): Observable<Voucher> {
    return this.http.post<Voucher>(`${this.BASE_URL}api/vouchers/`, payload);
  }

  // ============================
  // HOTSPOT PLANS
  // ============================
  getHotspotPlans(): Observable<HotspotPlan[]> {
    return this.http.get<HotspotPlan[]>(`${this.BASE_URL}api/hotspot-plans/`);
  }

  createHotspotPlan(plan: Partial<HotspotPlan>): Observable<HotspotPlan> {
    return this.http.post<HotspotPlan>(`${this.BASE_URL}api/hotspot-plans/`, plan);
  }

  rechargePlan(planId: string, amount: number): Observable<any> {
    return this.http.post(`${this.BASE_URL}api/hotspot-plans/${planId}/recharge/`, { amount });
  }

  // ============================
  // MIKROTIK MANAGEMENT
  // ============================
  listMikrotiks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}api/mikrotiks/`);
  }

  addMikrotik(payload: { host: string; username: string; password: string; port?: number }) {
    return this.http.post(`${this.BASE_URL}api/mikrotiks/`, payload);
  }

  resetMikrotik(data: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}api/mikrotik/reset/`, data);
  }
  // Delete a mikrotik by id
removeMikrotik(id: string): Observable<any> {
  return this.http.delete(`${this.BASE_URL}api/mikrotiks/${id}/`);
}

// Test connection for a mikrotik (backend should attempt connection and return status)
testMikrotik(id: string): Observable<{ ok: boolean; message?: string }> {
  return this.http.get<{ ok: boolean; message?: string }>(`${this.BASE_URL}api/mikrotiks/${id}/test/`);
}

  // ============================
  // REPORTS
  // ============================
  getReports(): Observable<any> {
    return this.http.get(`${this.BASE_URL}api/reports/overview/`);
  }

  // ============================
  // LEGACY ENDPOINTS
  // ============================
  getActiveUsers(): Observable<any> {
    return this.http.get(`${this.BASE_URL}users/active/`);
  }

  getPackages(): Observable<any> {
    return this.http.get(`${this.BASE_URL}packages/`);
  }

  getPerformance(): Observable<any> {
    return this.http.get(`${this.BASE_URL}performance/`);
  }

  getSmsSubscriptions(): Observable<any> {
    return this.http.get(`${this.BASE_URL}sms/subscriptions/`);
  }
}
