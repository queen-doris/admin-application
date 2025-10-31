'use client';

import { useEffect } from 'react';
import { useAuth } from '@/store/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AdminProfilePage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!isAuthenticated || !user || user.role !== 'admin') {
      router.push('/admin/login');
    }
  }, [loading, isAuthenticated, user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Admin Profile</span>
              <Button 
                variant="outline" 
                onClick={() => router.push('/admin/dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-gray-500">Name</div>
              <div className="text-lg font-medium">{user.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="text-lg font-medium">{user.email}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}