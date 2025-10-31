// API service for SMS application
export interface Transaction {
  id: string;
  userId: string;
  type: 'deposit' | 'withdrawal';
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  description?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  deviceId: string;
  balance: number;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface DashboardStats {
  totalCustomers: number;
  totalTransactions: number;
  totalDeposits: number;
  totalWithdrawals: number;
  pendingVerifications: number;
  lowBalanceCustomers: number;
}

class ApiService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'; // Admin backend

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('token');
    const sessionId = localStorage.getItem('sessionId');
    
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
        ...(sessionId && { 'X-Session-ID': sessionId }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  // Admin APIs
  async getCustomers(): Promise<Customer[]> {
    return this.request<Customer[]>('/api/admin/customers');
  }

  async getCustomer(id: string): Promise<Customer> {
    return this.request<Customer>(`/api/admin/customers/${id}`);
  }

  async verifyCustomer(id: string): Promise<void> {
    return this.request<void>(`/api/admin/customers/${id}/verify`, {
      method: 'POST',
    });
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.request<Transaction[]>('/api/admin/transactions');
  }

  async getDashboardStats(): Promise<DashboardStats> {
    return this.request<DashboardStats>('/api/admin/dashboard/stats');
  }

}

export const apiService = new ApiService();

