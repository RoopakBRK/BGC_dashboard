'use client';

import { useRouter } from 'next/navigation';
import { VerificationSession } from '@/types';
import { Check, X, Clock, AlertCircle, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper for status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
    case 'DECLINED': return 'bg-red-100 text-red-700 border-red-200';
    case 'NOT_STARTED': return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'EXPIRED': return 'bg-gray-100 text-gray-500 border-gray-200';
    default: return 'bg-blue-100 text-blue-700 border-blue-200';
  }
};

const WorkflowIcon = ({ status }: { status: string }) => {
  if (status === 'APPROVED') return <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check size={14} /></div>;
  if (status === 'DECLINED') return <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600"><X size={14} /></div>;
  if (status === 'NOT_STARTED') return <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400"><div className="h-2 w-2 rounded-full bg-gray-300" /></div>;
  return <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><Clock size={14} /></div>;
};

interface VerificationsTableProps {
  data: VerificationSession[];
}

export function VerificationsTable({ data }: VerificationsTableProps) {
  const router = useRouter();

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm text-gray-500">
        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
          <tr>
            <th className="px-6 py-4 font-medium"><input type="checkbox" className="rounded border-gray-300" /></th>
            <th className="px-6 py-4 font-medium">Session ID</th>
            <th className="px-6 py-4 font-medium">User</th>
            <th className="px-6 py-4 font-medium">Workflow</th>
            <th className="px-6 py-4 font-medium">Status</th>
            <th className="px-6 py-4 font-medium">Vendor</th>
            <th className="px-6 py-4 font-medium">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 border-t border-gray-200">
          {data.map((row) => (
            <tr 
              key={row.id} 
              onClick={() => router.push(`/verifications/${row.id.replace('#', '')}`)}
              className="cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                <input type="checkbox" className="rounded border-gray-300" />
              </td>
              <td className="px-6 py-4 font-medium text-gray-900">{row.id}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                    {row.user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{row.user.name}</div>
                    <div className="text-xs text-gray-500">{row.user.country} • {row.user.documentType}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex gap-1">
                  <WorkflowIcon status={row.steps.document} />
                  <WorkflowIcon status={row.steps.selfie} />
                  <WorkflowIcon status={row.steps.database} />
                  <WorkflowIcon status={row.steps.risk} />
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border",
                  getStatusColor(row.status)
                )}>
                  {row.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4">{row.vendor || '—'}</td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="text-gray-900">{new Date(row.createdAt).toLocaleDateString('en-US')}</span>
                  <span className="text-xs text-gray-400">{new Date(row.createdAt).toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
