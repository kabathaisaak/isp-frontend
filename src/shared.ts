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

  // ✅ Attach token for authenticated requests
  private getAuthHeaders() {
    const token = localStorage.getItem('access');
    return {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      }
    };
  }

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
    return this.http.get<Customer[]>(`${this.BASE_URL}billing/customers/active/`, this.getAuthHeaders());
  }

  getCustomerDetails(customerId: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.BASE_URL}billing/customers/${customerId}/`, this.getAuthHeaders());
  }

  // ============================
  // MIKROTIK MANAGEMENT
  // ============================
  listMikrotiks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}mikrotiks/`, this.getAuthHeaders());
  }

  addMikrotik(payload: { host: string; username: string; password: string; port?: number }) {
    return this.http.post(`${this.BASE_URL}mikrotiks/`, payload, this.getAuthHeaders());
  }

  removeMikrotik(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}mikrotiks/${id}/`, this.getAuthHeaders());
  }

  testMikrotik(id: string): Observable<{ ok: boolean; message?: string }> {
    return this.http.get<{ ok: boolean; message?: string }>(`${this.BASE_URL}mikrotiks/${id}/test/`, this.getAuthHeaders());
  }

  resetMikrotik(id: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}mikrotiks/${id}/reset/`, {}, this.getAuthHeaders());
  }

  getMyRouters(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}myrouters/`, this.getAuthHeaders());
  }

  // ============================
  // HOTSPOT PLANS / PACKAGES
  // ============================
  getHotspotPlans(): Observable<HotspotPlan[]> {
    return this.http.get<HotspotPlan[]>(`${this.BASE_URL}billing/plans/`, this.getAuthHeaders());
  }

  createHotspotPlan(plan: Partial<HotspotPlan>): Observable<HotspotPlan> {
    return this.http.post<HotspotPlan>(`${this.BASE_URL}billing/plans/`, plan, this.getAuthHeaders());
  }

  getPublicPlans() {
    return this.http.get<HotspotPlan[]>(`${this.BASE_URL}packages/public-plans/`);
  }

  getAdminPlans(adminId: string): Observable<HotspotPlan[]> {
    return this.http.get<HotspotPlan[]>(`${this.BASE_URL}billing/plans/admin/${adminId}/`, this.getAuthHeaders());
  }

  getPlansByMikrotik(mikrotikId: string): Observable<HotspotPlan[]> {
    return this.http.get<HotspotPlan[]>(`${this.BASE_URL}billing/plans/mikrotik/${mikrotikId}/`, this.getAuthHeaders());
  }

  toggleAutoConnect(planId: string, auto_on: boolean): Observable<any> {
    return this.http.patch(`${this.BASE_URL}billing/plans/${planId}/`, { auto_on }, this.getAuthHeaders());
  }

  // ============================
  // USERS MANAGEMENT
  // ============================
  getMe(): Observable<any> {
    return this.http.get(`${this.BASE_URL}auth/me/`, this.getAuthHeaders());
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}auth/users/`, this.getAuthHeaders());
  }

  getResellerCustomers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.BASE_URL}auth/reseller/customers/`, this.getAuthHeaders());
  }

  createUser(payload: any): Observable<any> {
    return this.http.post(`${this.BASE_URL}auth/users/create/`, payload, this.getAuthHeaders());
  }

  updateUser(userId: string, payload: any): Observable<any> {
    return this.http.patch(`${this.BASE_URL}auth/users/${userId}/`, payload, this.getAuthHeaders());
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}auth/users/${userId}/`, this.getAuthHeaders());
  }

  // ============================
  // PAYMENTS
  // ============================
  mpesaStkPush(planId: string, phoneNumber: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}payments/stk-push/`, {
      plan_id: planId,
      phone: phoneNumber,
    }, this.getAuthHeaders());
  }

  // ============================
  // REPORTS & PERFORMANCE
  // ============================
  getReports(): Observable<any> {
    return this.http.get(`${this.BASE_URL}reports/overview/`, this.getAuthHeaders());
  }

  getPerformance(): Observable<any> {
    return this.http.get(`${this.BASE_URL}dashboard/performance/`, this.getAuthHeaders());
  }

  // ============================
  // ADMIN PACKAGES CRUD
  // ============================
  getAdminPackages() {
    return this.http.get<any[]>(`${this.BASE_URL}auth/admin/packages/`, this.getAuthHeaders());
  }

  createAdminPackage(payload: any) {
    return this.http.post(`${this.BASE_URL}auth/admin/packages/`, payload, this.getAuthHeaders());
  }

  updateAdminPackage(id: string, payload: any) {
    return this.http.patch(`${this.BASE_URL}auth/admin/packages/${id}/`, payload, this.getAuthHeaders());
  }

  deleteAdminPackage(id: string) {
    return this.http.delete(`${this.BASE_URL}auth/admin/packages/${id}/`, this.getAuthHeaders());
  }

  // ============================
  // ADMIN MIKROTIK CRUD
  // ============================
  getMyMikrotiks() {
    return this.http.get<any[]>(`${this.BASE_URL}auth/admin/mikrotiks/`, this.getAuthHeaders());
  }

  createMikrotik(payload: any) {
    return this.http.post(`${this.BASE_URL}auth/admin/mikrotiks/`, payload, this.getAuthHeaders());
  }

  updateMikrotik(id: string, payload: any) {
    return this.http.patch(`${this.BASE_URL}auth/admin/mikrotiks/${id}/`, payload, this.getAuthHeaders());
  }

  deleteMikrotik(id: string) {
    return this.http.delete(`${this.BASE_URL}auth/admin/mikrotiks/${id}/`, this.getAuthHeaders());
  }
}
