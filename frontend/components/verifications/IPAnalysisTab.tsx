import { VerificationDetail } from '@/types';
import { ShieldCheck, Monitor, Smartphone, Globe, MapPin, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function IPAnalysisTab({ data }: { data: VerificationDetail }) {
  const { network, devices } = data;

  return (
    <div className="space-y-6">
      
      {/* Network Details Card */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
           <h3 className="font-semibold text-gray-900 flex items-center gap-2">
             <Globe size={18} className="text-blue-500" />
             Network details
           </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
               <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">IP Location</p>
               <p className="mt-1 text-sm font-medium text-gray-900">{network.ip}</p>
               <p className="text-xs text-gray-500">({network.location})</p>
            </div>
            <div>
               <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">IP City</p>
               <p className="mt-1 text-sm font-medium text-gray-900">{network.city}</p>
            </div>
             <div>
               <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">IP Country</p>
               <p className="mt-1 text-sm font-medium text-gray-900">{network.country}</p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Privacy Detection */}
            <div>
               <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Privacy Detection</p>
               <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-100 w-fit">
                 <CheckCircle2 size={16} />
                 <span className="font-medium">Status: No risks detected</span>
               </div>
               <div className="mt-4 flex flex-wrap gap-2">
                  <span className={cn("px-2 py-1 rounded text-xs border", !network.privacy.vpn ? "bg-gray-50 text-gray-500 border-gray-200" : "bg-red-50 text-red-700 border-red-200")}>VPN</span>
                  <span className={cn("px-2 py-1 rounded text-xs border", !network.privacy.tor ? "bg-gray-50 text-gray-500 border-gray-200" : "bg-red-50 text-red-700 border-red-200")}>Tor</span>
                  <span className={cn("px-2 py-1 rounded text-xs border", !network.privacy.proxy ? "bg-gray-50 text-gray-500 border-gray-200" : "bg-red-50 text-red-700 border-red-200")}>Proxy</span>
               </div>
            </div>

            {/* Document Distance */}
            <div>
               <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">Document address to IP location</p>
               <div className="flex items-center gap-2">
                 <MapPin size={18} className="text-gray-400" />
                 <span className="text-sm font-medium text-gray-900">Distance: {network.distanceFromDoc} km</span>
               </div>
               <div className="mt-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden max-w-xs">
                 <div className="h-full bg-blue-500 w-1/3 rounded-full" />
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* Device Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {devices?.map((device, idx) => (
          <div key={device.id} className="rounded-xl border border-gray-200 bg-white shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                {device.platform === 'mobile' ? <Smartphone size={20} /> : <Monitor size={20} />}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900">Device {idx + 1}</h4>
                <p className="text-xs text-gray-500">{device.platform === 'mobile' ? 'Mobile Device' : 'Desktop Computer'}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">IP Address</span>
                <span className="font-medium text-gray-900">{device.ip}</span>
              </div>
              {device.brand && (
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Brand</span>
                  <span className="font-medium text-gray-900">{device.brand}</span>
                </div>
              )}
              {device.model && (
                <div className="flex justify-between py-1 border-b border-gray-50">
                  <span className="text-gray-500">Model</span>
                  <span className="font-medium text-gray-900">{device.model}</span>
                </div>
              )}
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">OS</span>
                <span className="font-medium text-gray-900">{device.os}</span>
              </div>
               <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Browser</span>
                <span className="font-medium text-gray-900">{device.browser}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">ISP</span>
                <span className="font-medium text-gray-900 text-right max-w-[150px] truncate" title={device.isp}>{device.isp}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-50">
                <span className="text-gray-500">Timezone</span>
                <span className="font-medium text-gray-900">{device.timezone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Checks List */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
           <ShieldCheck size={24} className="text-green-600" />
           <div>
             <h3 className="text-sm font-semibold text-gray-900">Checks list</h3>
             <p className="text-xs text-gray-500">Global blocklist and sanction screening</p>
           </div>
         </div>
         <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
            <CheckCircle2 size={16} />
            <span className="font-medium">No risks detected</span>
         </div>
      </div>

    </div>
  );
}