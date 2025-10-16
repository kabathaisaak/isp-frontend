import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// ============================
// Interfaces
// ============================
export interface Customer {
  id: string;
  name?: string;
  ip_address: string;
  plan: string;
  mikrotik: string;
  amount: number;
  expiry: string;
  is_active?: boolean;
}

export interface Voucher {
  id: string;
  code: string;
  user?: string;
  amount: number;
  expiry: string;
  used: boolean;
}

export interface HotspotPlan {
  id: string;
  name: string;
  price: number;
  trial_days?: number;
  auto_on?: boolean;
  purchasers_count?: number;
}

// ============================
// Service
// ============================
@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'http://127.0.0.1:8000/api/';

  constructor(private http: HttpClient) {}

  // ============================
  // AUTH
  // ============================
  checkAdminExists(): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.BASE_URL}auth/check-admin/`);
  }

  registerAdmin(username: string, password: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}auth/register-admin/`, { username, password });
  }

  completeProfile(payload: FormData) {
    return this.http.post(`${this.BASE_URL}auth/complete-profile/`, payload);
  }

  login(username: string, password: string) {
    return this.http.post(`${this.BASE_URL}auth/login/`, { username, password });
  }

  // ============================
  // CUSTOMERS
  // ============================
  getActiveCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.BASE_URL}billing/customers/active/`);
  }

  getCustomerDetails(customerId: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.BASE_URL}billing/customers/${customerId}/`);
  }

  // ============================
  // MIKROTIK MANAGEMENT
  // ============================
  listMikrotiks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}mikrotiks/`);
  }

  addMikrotik(payload: { host: string; username: string; password: string; port?: number }) {
    return this.http.post(`${this.BASE_URL}mikrotiks/`, payload);
  }

  removeMikrotik(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}mikrotiks/${id}/`);
  }

  testMikrotik(id: string): Observable<{ ok: boolean; message?: string }> {
    return this.http.get<{ ok: boolean; message?: string }>(`${this.BASE_URL}mikrotiks/${id}/test/`);
  }

  resetMikrotik(id: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}mikrotiks/${id}/reset/`, {});
  }

  getMyRouters(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}myrouters/`);
  }

  // ============================
  // HOTSPOT PLANS / PACKAGES
  // ============================
  /** Fetch all plans (admin or public) */
  getHotspotPlans(): Observable<HotspotPlan[]> {
    return this.http.get<HotspotPlan[]>(`${this.BASE_URL}billing/plans/`);
  }

  /** Create a new hotspot plan (admin) */
  createHotspotPlan(plan: Partial<HotspotPlan>): Observable<HotspotPlan> {
    return this.http.post<HotspotPlan>(`${this.BASE_URL}billing/plans/`, plan);
  }

 getPublicPlans() {
  return this.http.get<HotspotPlan[]>(`${this.BASE_URL}packages/public-plans/`);
}



  /** Admin-only: fetch plans created by this admin */
  getAdminPlans(adminId: string): Observable<HotspotPlan[]> {
    return this.http.get<HotspotPlan[]>(`${this.BASE_URL}billing/plans/admin/${adminId}/`);
  }

  /** Subscriber: fetch plans available for their connected Mikrotik */
  getPlansByMikrotik(mikrotikId: string): Observable<HotspotPlan[]> {
    return this.http.get<HotspotPlan[]>(`${this.BASE_URL}billing/plans/mikrotik/${mikrotikId}/`);
  }

  toggleAutoConnect(planId: string, auto_on: boolean): Observable<any> {
    return this.http.patch(`${this.BASE_URL}billing/plans/${planId}/`, { auto_on });
  }

  // ============================
  // USERS MANAGEMENT
  // ============================
  getMe(): Observable<any> {
    return this.http.get(`${this.BASE_URL}auth/me/`);
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}auth/users/`);
  }

  getResellerCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}auth/reseller/customers/`);
  }

  createUser(payload: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}auth/users/create/`, payload);
  }

  updateUser(userId: string, payload: any): Observable<any> {
    return this.http.patch(`${this.BASE_URL}auth/users/${userId}/`, payload);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}auth/users/${userId}/`);
  }

  // ============================
  // PAYMENTS
  // ============================
  mpesaStkPush(planId: string, phoneNumber: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}payments/stk-push/`, {
      plan_id: planId,
      phone: phoneNumber,
    });
  }

  // ============================
  // REPORTS
  // ============================
  getReports(): Observable<any> {
    return this.http.get(`${this.BASE_URL}reports/overview/`);
  }

  getPerformance(): Observable<any> {
  return this.http.get(`${this.BASE_URL}dashboard/performance/`);
}
}
