"use client";

import { useState } from 'react';

export default function ApiTest() {
  const [status, setStatus] = useState<string>('idle');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testApi = async () => {
    setStatus('loading');
    setError(null);
    
    try {
      const response = await fetch('/api/test');
      if (!response.ok) throw new Error('API test failed');
      
      const result = await response.json();
      setData(result);
      setStatus('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setStatus('error');
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">API Connection Test</h3>
      
      <button
        onClick={testApi}
        disabled={status === 'loading'}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {status === 'loading' ? 'Testing...' : 'Test API Connection'}
      </button>

      {status === 'success' && data && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <h4 className="font-semibold text-green-800">✅ Connection Successful</h4>
          <pre className="text-sm text-green-700 mt-2">{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}

      {status === 'error' && error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <h4 className="font-semibold text-red-800">❌ Connection Failed</h4>
          <p className="text-sm text-red-700 mt-2">{error}</p>
        </div>
      )}
    </div>
  );
} 