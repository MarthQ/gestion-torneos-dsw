// Const object for type extraction
const ENV = {
  apiUrl: (typeof window !== 'undefined' && window.__env?.apiUrl) || 'http://localhost:3000/api',
} as const;

export const environment = {
  apiUrl: ENV.apiUrl,
};

// Type augmentation for window.__env
declare global {
  interface Window {
    __env?: {
      apiUrl?: string;
    };
  }
}
