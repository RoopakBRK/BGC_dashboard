import { VerificationDetail } from '@/types';
import { Mail, Phone, MapPin, Smartphone, AlertTriangle } from 'lucide-react';

export function OverviewTab({ data }: { data: VerificationDetail }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {/* Contact Details */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Contact Details</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Mail size={16} />
            </div>
            <div>
              <p className="font-medium text-gray-900">Email</p>
              <p className="text-gray-500">{data.user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Phone size={16} />
            </div>
            <div>
              <p className="font-medium text-gray-900">Phone</p>
              <p className="text-gray-500">{data.user.phone || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <MapPin size={16} />
            </div>
            <div>
              <p className="font-medium text-gray-900">Country</p>
              <p className="text-gray-500">{data.user.country}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Info */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-gray-900">Verification Info</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Session ID</span>
            <span className="font-medium text-gray-900">{data.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Created at</span>
            <span className="font-medium text-gray-900">{new Date(data.createdAt).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Vendor</span>
            <span className="font-medium text-gray-900">{data.vendor}</span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-gray-500">Device</span>
             <div className="flex items-center gap-1 text-gray-900">
               <Smartphone size={14} className="text-gray-400" />
               <span className="font-medium">{data.device.os}</span>
             </div>
          </div>
        </div>
      </div>

      {/* Warnings */}
      <div className="rounded-xl border border-orange-200 bg-orange-50 p-6 shadow-sm">
        <h3 className="mb-4 text-base font-semibold text-orange-900 flex items-center gap-2">
          <AlertTriangle size={18} />
          Warnings
        </h3>
        <div className="space-y-2">
          {data.warnings.map((warning, idx) => (
            <div key={idx} className="flex items-start gap-2 rounded-md bg-white/60 p-2 text-sm text-orange-800">
              <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              {warning}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
