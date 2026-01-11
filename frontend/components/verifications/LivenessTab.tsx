import { VerificationDetail } from '@/types';
import Image from 'next/image';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LivenessTab({ data }: { data: VerificationDetail }) {
  const isPass = data.liveness.status === 'PASS';

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Selfie Image */}
        <div className="flex items-center gap-6">
          <div className="space-y-2 text-center">
            <div className="relative h-40 w-40 overflow-hidden rounded-full border-4 border-gray-100 shadow-sm">
              <Image src={data.liveness.selfieUrl} alt="Selfie" fill className="object-cover" />
            </div>
            <p className="text-xs font-medium text-gray-500">Live Selfie</p>
          </div>
        </div>

        {/* Score & Status */}
        <div className="flex flex-col items-center md:items-end space-y-2 flex-1 max-w-sm">
           <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <span className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-medium",
              isPass ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {isPass ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {data.liveness.status}
            </span>
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-700">Liveness Score</span>
                <span className="font-bold text-gray-900">{data.liveness.score}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-100">
                <div 
                className={cn("h-2.5 rounded-full", isPass ? "bg-green-500" : "bg-red-500")} 
                style={{ width: `${data.liveness.score}%` }} 
                />
            </div>
          </div>
          <p className="text-xs text-gray-400">Probability that the user is a real person</p>
        </div>

      </div>
    </div>
  );
}
