import { VerificationDetail } from '@/types';
import Image from 'next/image';

export function IDVerificationTab({ data }: { data: VerificationDetail }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Document Images */}
        <div className="space-y-4">
           <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
             <p className="mb-2 text-sm font-medium text-gray-500">Front Side</p>
             <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
               <Image 
                 src={data.documents.front} 
                 alt="ID Front" 
                 fill
                 className="object-cover"
               />
             </div>
           </div>
           <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
             <p className="mb-2 text-sm font-medium text-gray-500">Back Side</p>
             <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
               <Image 
                 src={data.documents.back} 
                 alt="ID Back" 
                 fill
                 className="object-cover"
               />
             </div>
           </div>
        </div>

        {/* Extracted Data */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm h-fit">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">Extracted Data</h3>
          <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">First Name</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{data.documents.details.firstName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Last Name</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{data.documents.details.lastName}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Date of Birth</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{data.documents.details.dob}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Document Number</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{data.documents.details.docNumber}</p>
            </div>
             <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Expiry Date</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{data.documents.details.expiryDate}</p>
            </div>
             <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Country</p>
              <p className="mt-1 text-sm font-medium text-gray-900">{data.user.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
