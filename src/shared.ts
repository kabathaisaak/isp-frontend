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
  private BASE_URL = 'http://127.0.0.1:8000/';

  constructor(private http: HttpClient) {}

  // ============================
  // AUTH
  // ============================
  // ============================
// AUTH
// ============================

// ✅ Check if an admin already exists
checkAdminExists(): Observable<{ exists: boolean }> {
  return this.http.get<{ exists: boolean }>(`${this.BASE_URL}api/auth/check-admin/`);
}

// ✅ Register the first admin account (only if none exists)
registerAdmin(username: string, password: string): Observable<any> {
  return this.http.post(`${this.BASE_URL}api/auth/register-admin/`, { username, password });
}

completeProfile(payload: FormData) {
  return this.http.post(`${this.BASE_URL}api/auth/complete-profile/`, payload);
}


login(username: string, password: string) {
  return this.http.post(`${this.BASE_URL}api/auth/login/`, { username, password });
}


  // ============================
  // CUSTOMERS
  // ============================
 getActiveCustomers(): Observable<Customer[]> {
  return this.http.get<Customer[]>(`${this.BASE_URL}/api/billing/customers/active/`);
}


  getCustomerDetails(customerId: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.BASE_URL}api/customers/${customerId}/`);
  }

  fetchDeviceSessionDetails(mikrotikId: string, customerIp: string) {
    return this.http.get(
      `${this.BASE_URL}api/mikrotiks/${mikrotikId}/session/?ip=${encodeURIComponent(customerIp)}`
    );
  }

  // ============================
  // VOUCHERS
  // ============================
  getExpiringVouchers(): Observable<Voucher[]> {
    return this.http.get<Voucher[]>(`${this.BASE_URL}api/vouchers/expiring/`);
  }

  createVoucher(payload: { amount: number; expiry: string; userId?: string }): Observable<Voucher> {
    return this.http.post<Voucher>(`${this.BASE_URL}api/vouchers/`, payload);
  }

  // ============================
  // HOTSPOT PLANS
  // ============================


  /** Create a new hotspot plan */
 /** List all hotspot plans */
getHotspotPlans(): Observable<HotspotPlan[]> {
  return this.http.get<HotspotPlan[]>(`${this.BASE_URL}api/packages/hotspot-plans/`);
}

/** Create a new hotspot plan */
createHotspotPlan(plan: Partial<HotspotPlan>): Observable<HotspotPlan> {
  return this.http.post<HotspotPlan>(`${this.BASE_URL}api/packages/hotspot-plans/`, plan);
}

/** Recharge an existing hotspot plan */
rechargePlan(planId: string, amount: number): Observable<any> {
  return this.http.post(`${this.BASE_URL}api/packages/hotspot-plans/${planId}/recharge/`, { amount });
}

/** Create a trial user for a hotspot plan */
createTrialUser(planId: string, days: number): Observable<any> {
  return this.http.post(`${this.BASE_URL}api/packages/hotspot-plans/${planId}/trial/`, { days });
}

/** Toggle auto online/offline mode */
toggleAutoConnect(planId: string, autoOn: boolean): Observable<any> {
  return this.http.patch(`${this.BASE_URL}api/packages/hotspot-plans/${planId}/auto-connect/`, { autoOn });
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

  resetMikrotik(id: string): Observable<any> {
    return this.http.post(`${this.BASE_URL}api/mikrotiks/${id}/reset/`, {});
  }

  removeMikrotik(id: string): Observable<any> {
    return this.http.delete(`${this.BASE_URL}api/mikrotiks/${id}/`);
  }

  testMikrotik(id: string): Observable<{ ok: boolean; message?: string }> {
    return this.http.get<{ ok: boolean; message?: string }>(
      `${this.BASE_URL}api/mikrotiks/${id}/test/`
    );
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
    return this.http.get(`${this.BASE_URL}/api/performance/`);
  }

  getSmsSubscriptions(): Observable<any> {
    return this.http.get(`${this.BASE_URL}sms/subscriptions/`);
  }

  // ============================
  // PUBLIC PLANS & PURCHASE
  // ============================
 getPublicPlans(): Observable<HotspotPlan[]> {
  return this.http.get<HotspotPlan[]>(`${this.BASE_URL}api/packages/public-plans/`);
}

purchasePlan(planId: string, identifier: string): Observable<any> {
  return this.http.post(`${this.BASE_URL}api/billing/public-purchase/`, { plan_id: planId, identifier });
}


// ============================
// M-PESA PAYMENTS
// ============================
/**
 * Initiates an M-Pesa STK Push request for the given plan & phone number
 */
mpesaStkPush(planId: string, phoneNumber: string): Observable<any> {
  return this.http.post(`${this.BASE_URL}api/payments/stk-push/`, {
    plan_id: planId,
    phone: phoneNumber
  });
}


}
