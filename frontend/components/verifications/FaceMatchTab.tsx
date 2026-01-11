import { VerificationDetail } from '@/types';
import Image from 'next/image';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FaceMatchTab({ data }: { data: VerificationDetail }) {
  const isMatch = data.faceMatch.status === 'MATCH';
  
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Comparison Images */}
        <div className="flex items-center gap-6">
          <div className="space-y-2 text-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gray-100 shadow-sm">
              <Image src={data.documents.front} alt="Document Face" fill className="object-cover" />
            </div>
            <p className="text-xs font-medium text-gray-500">Document</p>
          </div>
          
          <div className="flex flex-col items-center gap-1">
             <div className={cn("h-1 w-12 rounded-full", isMatch ? "bg-green-500" : "bg-red-500")} />
             <span className={cn("text-xs font-bold", isMatch ? "text-green-600" : "text-red-600")}>
               {data.faceMatch.score}% MATCH
             </span>
          </div>

          <div className="space-y-2 text-center">
            <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-gray-100 shadow-sm">
              <Image src={data.liveness.selfieUrl} alt="Selfie" fill className="object-cover" />
            </div>
            <p className="text-xs font-medium text-gray-500">Selfie</p>
          </div>
        </div>

        {/* Status */}
        <div className="flex flex-col items-center md:items-end space-y-2 min-w-[200px]">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">Status</span>
            <span className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-sm font-medium",
              isMatch ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {isMatch ? <CheckCircle size={14} /> : <XCircle size={14} />}
              {data.faceMatch.status}
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div 
              className={cn("h-2.5 rounded-full", isMatch ? "bg-green-500" : "bg-red-500")} 
              style={{ width: `${data.faceMatch.score}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-400">Confidence Score: {data.faceMatch.score}/100</p>
        </div>
      </div>
    </div>
  );
}
