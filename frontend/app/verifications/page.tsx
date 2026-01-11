import { VerificationsTable } from '@/components/tables/VerificationsTable';
import { mockVerifications } from '@/lib/mockData';
import { Plus, Bell, Settings } from 'lucide-react';

export default function VerificationsPage() {
  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Verifications</h1>
          <p className="mt-1 text-sm text-gray-500">{mockVerifications.length} verifications</p>
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

      <VerificationsTable data={mockVerifications} />
    </div>
  );
}
