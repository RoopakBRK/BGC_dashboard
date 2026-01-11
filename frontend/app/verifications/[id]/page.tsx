'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreHorizontal, Download, Share2 } from 'lucide-react';
import { mockVerificationDetail } from '@/lib/mockData';
import { OverviewTab } from '@/components/verifications/OverviewTab';
import { IDVerificationTab } from '@/components/verifications/IDVerificationTab';
import { LivenessTab } from '@/components/verifications/LivenessTab';
import { FaceMatchTab } from '@/components/verifications/FaceMatchTab';
import { IPAnalysisTab } from '@/components/verifications/IPAnalysisTab';
import { EventsTab } from '@/components/verifications/EventsTab';
import { WebhooksTab } from '@/components/verifications/WebhooksTab';
import { cn } from '@/lib/utils';

const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'id-verification', label: 'ID Verification' },
  { id: 'liveness', label: 'Liveness' },
  { id: 'face-match', label: 'Face Match' },
  { id: 'ip-analysis', label: 'IP Analysis' },
  { id: 'events', label: 'Events' },
  { id: 'webhooks', label: 'Webhooks' },
];

export default function VerificationDetailPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState('overview');
  const data = mockVerificationDetail; 

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header (approx 180px)
      const y = element.getBoundingClientRect().top + window.scrollY - 180;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  // Simple scroll spy
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200; // Offset
      
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
            setActiveSection(section.id);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      {/* Top Header (Static) */}
      <div className="bg-white border-b border-gray-200 px-8 pt-6 pb-0 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.back()} 
            className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{data.user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-700 border border-green-200">
                {data.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Session {data.id} • Started on {new Date(data.createdAt).toLocaleDateString('en-US')}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-3">
             <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
               <Download size={16} />
               Export
             </button>
             <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
               <Share2 size={20} />
             </button>
             <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
               <MoreHorizontal size={20} />
             </button>
          </div>
        </div>

        {/* Sticky Navigation Tabs */}
        <div className="flex items-center gap-8 border-b border-transparent -mb-px overflow-x-auto no-scrollbar">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={cn(
                "pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeSection === section.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              )}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-8 flex-1">
        <div className="max-w-5xl mx-auto space-y-12 pb-20">
          
          <section id="overview" className="scroll-mt-48">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
            <OverviewTab data={data} />
          </section>

          <section id="id-verification" className="scroll-mt-48">
            <div className="flex items-center justify-between mb-4">
               <h2 className="text-lg font-semibold text-gray-900">ID Verification</h2>
               <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded">PASSED</span>
            </div>
            <IDVerificationTab data={data} />
          </section>

          <section id="liveness" className="scroll-mt-48">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Liveness Check</h2>
            <LivenessTab data={data} />
          </section>

          <section id="face-match" className="scroll-mt-48">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Face Match</h2>
            <FaceMatchTab data={data} />
          </section>

          <section id="ip-analysis" className="scroll-mt-48">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">IP Analysis</h2>
            <IPAnalysisTab data={data} />
          </section>

          <section id="events" className="scroll-mt-48">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Events Timeline</h2>
            <EventsTab data={data} />
          </section>

          <section id="webhooks" className="scroll-mt-48">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Webhooks</h2>
            <WebhooksTab data={data} />
          </section>

        </div>
      </div>
    </div>
  );
}