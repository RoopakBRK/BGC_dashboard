import { VerificationDetail } from '@/types';
import { ChevronRight, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WebhooksTab({ data }: { data: VerificationDetail }) {
  return (
    <div className="space-y-4">
      {data.webhooks.map((hook) => (
        <div key={hook.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="flex items-center gap-4 bg-gray-50/50 px-4 py-3 border-b border-gray-100">
             <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
               <Globe size={16} />
             </div>
             <div className="flex-1">
               <div className="flex items-center gap-2">
                 <span className="font-mono text-sm font-semibold text-gray-900">{hook.event}</span>
                 <span className={cn(
                   "px-2 py-0.5 rounded text-xs font-medium",
                   hook.status >= 200 && hook.status < 300 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                 )}>
                   {hook.status}
                 </span>
               </div>
               <span className="text-xs text-gray-500">{new Date(hook.timestamp).toLocaleString()}</span>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
            <div className="p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Payload</p>
              <pre className="overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-50">
                {JSON.stringify(hook.payload, null, 2)}
              </pre>
            </div>
            <div className="p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-gray-500">Response</p>
              <pre className="overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-600 border border-gray-200">
                {JSON.stringify(hook.response, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
