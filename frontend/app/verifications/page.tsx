'use client';

import { useState, useEffect } from 'react';
import { VerificationsTable } from '@/components/tables/VerificationsTable';
import { VerificationSession } from '@/types';
import { fetchFromApi } from '@/lib/api';
import { Plus, Bell, Settings, Loader2 } from 'lucide-react';

export default function VerificationsPage() {
  const [data, setData] = useState<VerificationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadVerifications() {
      try {
        const sessions = await fetchFromApi<VerificationSession[]>('/api/verifications');
        setData(sessions);
      } catch (err) {
        console.error('Failed to load verifications:', err);
        setError('Failed to load verifications. Ensure backend is running.');
      } finally {
        setLoading(false);
      }
    }
    loadVerifications();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <p className="text-red-500 font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Verifications</h1>
          <p className="mt-1 text-sm text-gray-500">{data.length} verifications</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
            <Bell size={20} />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 hover:bg-gray-50">
            <Settings size={20} />
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 shadow-sm">
            <Plus size={18} />
            New session
          </button>
        </div>
      </div>

      <VerificationsTable data={data} />
    </div>
  );
}