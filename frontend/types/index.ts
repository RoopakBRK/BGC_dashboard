export type VerificationStatus = 'APPROVED' | 'DECLINED' | 'NEEDS_REVIEW' | 'NOT_STARTED' | 'EXPIRED';

export type VerificationStepStatus = 'PENDING' | 'APPROVED' | 'DECLINED' | 'NOT_STARTED';

export interface UserInfo {
  name: string;
  avatarUrl?: string;
  email: string;
  phone?: string;
  country: string;
  documentType: string;
}

export interface VerificationSession {
  id: string;
  user: UserInfo;
  status: VerificationStatus;
  createdAt: string; // ISO string
  vendor?: string;
  steps: {
    document: VerificationStepStatus;
    selfie: VerificationStepStatus;
    database: VerificationStepStatus;
    risk: VerificationStepStatus;
  };
}

export interface NetworkDetails {
  ip: string;
  location: string;
  city: string;
  country: string;
  isp: string;
  timezone: string;
  privacy: {
    status: 'CLEAN' | 'RISK';
    vpn: boolean;
    tor: boolean;
    proxy: boolean;
    dataCenter: boolean;
  };
  distanceFromDoc: number; // km
}

export interface DeviceInfo {
    id: string;
    ip: string;
    platform: 'mobile' | 'desktop';
    brand?: string;
    model?: string;
    os: string;
    browser: string;
    isp: string;
    timezone: string;
    distanceMatch: boolean;
    privacy: {
        vpn: boolean;
        tor: boolean;
        dataCenter: boolean;
    };
}

export interface VerificationEvent {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' | 'CHANGE';
  title: string;
  description: string;
  timestamp: string;
  thumbnails?: string[]; // URLs
  metadata?: {
    component?: string;
    platform?: string;
    browser?: string;
    ip?: string;
    location?: string;
  };
}

export interface VerificationWebhook {
  id: string;
  event: string;
  status: number;
  timestamp: string;
  payload: Record<string, any>;
  response: Record<string, any>;
}

export interface VerificationDetail extends VerificationSession {
  device: {
    type: string;
    os: string;
    browser: string;
    ip: string;
    location: string;
  };
  network: NetworkDetails; // New
  devices: DeviceInfo[]; // New
  warnings: string[];
  documents: {
    front: string; // URL
    back: string; // URL
    details: {
      firstName: string;
      lastName: string;
      dob: string;
      docNumber: string;
      expiryDate: string;
    };
  };
  liveness: {
    score: number;
    status: 'PASS' | 'FAIL';
    selfieUrl: string;
  };
  faceMatch: {
    score: number;
    status: 'MATCH' | 'NO_MATCH';
  };
  events: VerificationEvent[];
  webhooks: VerificationWebhook[];
}
