'use client';

import { useAuth } from "@/store/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Page() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && user?.role === 'admin') {
        router.push('/admin/dashboard');
      } else if (!isAuthenticated) {
        router.push('/admin/login');
      }
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Portal</h1>
        <p className="text-gray-600 mb-8">Savings Management System</p>
        <Button 
          size="lg" 
          onClick={() => router.push('/admin/login')}
          className="px-8 py-3"
        >
          Login to Admin Portal
        </Button>
      </div>
    </div>
  )
}
