// Authentication service for SMS application
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'client';
  deviceId?: string;
  balance?: number;
  isVerified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  otp?: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  deviceId: string;
}

class AuthService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'; // Admin backend

  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const sessionId = response.headers.get('X-Session-ID');
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
    }

    return response.json();
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response = await fetch(`${this.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Registration failed');
    }

    const sessionId = response.headers.get('X-Session-ID');
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
    }

    return response.json();
  }

  async logout(): Promise<void> {
    const token = localStorage.getItem('token');
    const sessionId = localStorage.getItem('sessionId');
    if (token) {
      await fetch(`${this.baseUrl}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(sessionId ? { 'X-Session-ID': sessionId } : {}),
        },
      });
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('sessionId');
  }

  async getCurrentUser(): Promise<User | null> {
    const token = localStorage.getItem('token');
    const sessionId = localStorage.getItem('sessionId');
    if (!token) return null;

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...(sessionId ? { 'X-Session-ID': sessionId } : {}),
        },
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      return response.json();
    } catch (error) {
      this.logout();
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const authService = new AuthService();

