import { VerificationDetail } from '@/types';
import { CheckCircle2, AlertTriangle, Info, XCircle, FileText, MousePointer2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function EventsTab({ data }: { data: VerificationDetail }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="p-8">
        <div className="space-y-8 relative">
          {/* Vertical Guide Line */}
          <div className="absolute left-[8.5rem] top-2 bottom-2 w-0.5 bg-gray-100 hidden md:block" />

          {data.events.map((event) => {
            let Icon = Info;
            let iconColor = 'text-blue-500 bg-blue-50 border-blue-100';
            
            if (event.type === 'SUCCESS') { Icon = CheckCircle2; iconColor = 'text-green-600 bg-green-50 border-green-100'; }
            if (event.type === 'WARNING') { Icon = AlertTriangle; iconColor = 'text-orange-600 bg-orange-50 border-orange-100'; }
            if (event.type === 'ERROR') { Icon = XCircle; iconColor = 'text-red-600 bg-red-50 border-red-100'; }

            return (
              <div key={event.id} className="flex flex-col md:flex-row gap-6 md:gap-10 relative">
                
                {/* Timestamp (Left) */}
                <div className="md:w-28 flex-shrink-0 text-right pt-1 hidden md:block">
                  <span className="text-sm font-medium text-gray-900 block">
                    {new Date(event.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span className="text-xs text-gray-400 block">
                    {new Date(event.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>

                {/* Icon (Center Guide) */}
                <div className={cn(
                  "absolute left-[8.5rem] -translate-x-1/2 bg-white p-1 hidden md:block z-10"
                )}>
                  <div className={cn("h-3 w-3 rounded-full border-2", 
                    event.type === 'SUCCESS' ? 'border-green-500 bg-green-500' : 
                    event.type === 'ERROR' ? 'border-red-500 bg-red-500' : 
                    'border-blue-500 bg-blue-500'
                  )} />
                </div>

                {/* Content (Center + Right) */}
                <div className="flex-1 flex flex-col lg:flex-row gap-6 pt-0.5">
                   {/* Main Event Data */}
                   <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2 md:hidden">
                        <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex items-start gap-3">
                        <div className={cn("flex-shrink-0 h-8 w-8 rounded-lg flex items-center justify-center border", iconColor)}>
                           <Icon size={16} />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-gray-900">{event.title}</h4>
                          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{event.description}</p>
                        </div>
                      </div>

                      {/* Thumbnails if any */}
                      {event.thumbnails && event.thumbnails.length > 0 && (
                        <div className="flex gap-3 pl-11">
                          {event.thumbnails.map((url, idx) => (
                            <div key={idx} className="relative h-16 w-24 rounded-md overflow-hidden border border-gray-200 shadow-sm hover:opacity-90 transition-opacity cursor-pointer">
                              <Image src={url} alt="Event Thumbnail" fill className="object-cover" />
                            </div>
                          ))}
                        </div>
                      )}
                   </div>

                   {/* Metadata (Right) */}
                   {event.metadata && (
                     <div className="lg:w-48 flex-shrink-0 space-y-2 text-xs text-gray-500 border-l border-gray-100 lg:pl-6">
                        {event.metadata.component && (
                          <div className="flex items-center gap-2">
                            <FileText size={12} className="text-gray-400" />
                            <span>{event.metadata.component}</span>
                          </div>
                        )}
                        {event.metadata.platform && (
                          <div className="flex items-center gap-2">
                             <MousePointer2 size={12} className="text-gray-400" />
                             <span>{event.metadata.platform}</span>
                          </div>
                        )}
                        {event.metadata.ip && (
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded font-mono text-gray-600">
                               {event.metadata.ip}
                             </span>
                          </div>
                        )}
                        {event.metadata.location && (
                          <div className="flex items-center gap-2 text-gray-400">
                             <span>{event.metadata.location}</span>
                          </div>
                        )}
                     </div>
                   )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}