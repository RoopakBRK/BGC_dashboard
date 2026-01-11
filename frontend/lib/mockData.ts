import { VerificationSession, VerificationDetail } from '../types';

export const mockVerifications: VerificationSession[] = [
  {
    id: '#826',
    user: {
      name: 'Roopak Krishna',
      email: 'roopak2804@gmail.com',
      country: 'India',
      documentType: 'Identity Card',
      avatarUrl: '',
    },
    status: 'APPROVED',
    createdAt: '2023-10-26T10:23:00Z',
    vendor: 'Veriff',
    steps: {
      document: 'APPROVED',
      selfie: 'APPROVED',
      database: 'APPROVED',
      risk: 'APPROVED',
    },
  },
  {
    id: '#825',
    user: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      country: 'USA',
      documentType: 'Driver License',
    },
    status: 'DECLINED',
    createdAt: '2023-10-26T09:15:00Z',
    steps: {
      document: 'APPROVED',
      selfie: 'DECLINED',
      database: 'APPROVED',
      risk: 'APPROVED',
    },
  },
  {
    id: '#824',
    user: {
      name: 'Rahul Verma',
      email: 'rahul.verma@example.com',
      country: 'India',
      documentType: 'PAN Card',
    },
    status: 'NOT_STARTED',
    createdAt: '2023-10-25T14:50:00Z',
    steps: {
      document: 'NOT_STARTED',
      selfie: 'NOT_STARTED',
      database: 'NOT_STARTED',
      risk: 'NOT_STARTED',
    },
  },
  {
    id: '#823',
    user: {
      name: 'Sarah Smith',
      email: 'sarah.smith@example.com',
      country: 'UK',
      documentType: 'Passport',
    },
    status: 'EXPIRED',
    createdAt: '2023-10-25T11:00:00Z',
    steps: {
      document: 'NOT_STARTED',
      selfie: 'NOT_STARTED',
      database: 'NOT_STARTED',
      risk: 'NOT_STARTED',
    },
  },
];

export const mockVerificationDetail: VerificationDetail = {
  ...mockVerifications[0],
  device: {
    type: 'Mobile',
    os: 'iOS 17',
    browser: 'Mobile Safari',
    ip: '49.37.170.8',
    location: 'Bengaluru, India',
  },
  network: {
    ip: '49.37.170.8',
    location: 'Bengaluru, Karnataka, India',
    city: 'Bengaluru',
    country: 'India',
    isp: 'Bharti Airtel Ltd.',
    timezone: 'Asia/Kolkata',
    privacy: {
      status: 'CLEAN',
      vpn: false,
      tor: false,
      proxy: false,
      dataCenter: false,
    },
    distanceFromDoc: 783.64,
  },
  devices: [
    {
      id: 'dev_1',
      ip: '49.37.170.8',
      platform: 'mobile',
      brand: 'Apple',
      model: 'iPhone 14 Pro',
      os: 'iOS 17.0.1',
      browser: 'Mobile Safari',
      isp: 'Bharti Airtel Ltd.',
      timezone: 'Asia/Kolkata',
      distanceMatch: true,
      privacy: { vpn: false, tor: false, dataCenter: false }
    },
    {
      id: 'dev_2',
      ip: '103.45.2.1',
      platform: 'desktop',
      os: 'Windows 11',
      browser: 'Edge',
      isp: 'Reliance Jio Infocomm Limited',
      timezone: 'Asia/Kolkata',
      distanceMatch: true,
      privacy: { vpn: false, tor: false, dataCenter: false }
    }
  ],
  warnings: [
    'IP address distance > 100km from ID address',
    'Browser language different from country'
  ],
  documents: {
    front: 'https://placehold.co/600x400/e2e8f0/475569?text=ID+Front',
    back: 'https://placehold.co/600x400/e2e8f0/475569?text=ID+Back',
    details: {
      firstName: 'Roopak',
      lastName: 'Krishna',
      dob: '1995-08-15',
      docNumber: 'ABCD1234E',
      expiryDate: '2030-01-01',
    },
  },
  liveness: {
    score: 98,
    status: 'PASS',
    selfieUrl: 'https://placehold.co/400x400/e2e8f0/475569?text=Selfie',
  },
  faceMatch: {
    score: 95,
    status: 'MATCH',
  },
  events: [
    {
      id: 'evt_1',
      type: 'SUCCESS',
      title: 'Session Approved',
      description: 'The verification session was automatically approved based on the workflow rules.',
      timestamp: '2023-10-26T10:28:00Z',
      metadata: {
        component: 'Workflow Engine',
        platform: 'Server',
      }
    },
    {
      id: 'evt_2',
      type: 'INFO',
      title: 'Face Match Completed',
      description: 'Facial comparison between document and selfie completed successfully.',
      timestamp: '2023-10-26T10:27:45Z',
      metadata: {
        component: 'Face Match API',
        ip: '49.37.170.8',
        location: 'Bengaluru, IN'
      }
    },
    {
      id: 'evt_3',
      type: 'INFO',
      title: 'Liveness Check Passed',
      description: 'User successfully completed the active liveness challenge.',
      timestamp: '2023-10-26T10:27:30Z',
      thumbnails: ['https://placehold.co/200x200/e2e8f0/475569?text=Selfie'],
      metadata: {
        component: 'Liveness SDK',
        platform: 'iOS',
        browser: 'Mobile Safari',
        ip: '49.37.170.8'
      }
    },
    {
      id: 'evt_4',
      type: 'INFO',
      title: 'Document Uploaded',
      description: 'User uploaded front and back of Identity Card.',
      timestamp: '2023-10-26T10:25:00Z',
      thumbnails: [
        'https://placehold.co/300x200/e2e8f0/475569?text=Front',
        'https://placehold.co/300x200/e2e8f0/475569?text=Back'
      ],
      metadata: {
        component: 'Doc Upload',
        platform: 'iOS',
        browser: 'Mobile Safari',
        ip: '49.37.170.8',
        location: 'Bengaluru, IN'
      }
    },
    {
      id: 'evt_5',
      type: 'INFO',
      title: 'Session Started',
      description: 'User initiated verification session via shared link.',
      timestamp: '2023-10-26T10:23:00Z',
      metadata: {
        component: 'Web Client',
        platform: 'iOS',
        browser: 'Mobile Safari',
        ip: '49.37.170.8',
        location: 'Bengaluru, IN'
      }
    },
  ],
  webhooks: [
    {
      id: 'wh_1',
      event: 'verification.completed',
      status: 200,
      timestamp: '2023-10-26T10:28:05Z',
      payload: {
        sessionId: '#826',
        status: 'APPROVED',
      },
      response: {
        success: true,
      },
    },
    {
      id: 'wh_2',
      event: 'verification.started',
      status: 200,
      timestamp: '2023-10-26T10:23:05Z',
      payload: {
        sessionId: '#826',
        status: 'STARTED',
      },
      response: {
        success: true,
      },
    },
  ],
};
