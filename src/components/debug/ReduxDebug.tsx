'use client';

import { useSelector } from 'react-redux';

export default function ReduxDebug() {
  const auth = useSelector((state: any) => state.auth);
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg max-w-md text-xs overflow-auto max-h-96 z-50">
      <h3 className="font-bold mb-2">Redux Auth State:</h3>
      <pre>{JSON.stringify(auth, null, 2)}</pre>
      <h3 className="font-bold mt-4 mb-2">LocalStorage:</h3>
      <pre>Token: {localStorage.getItem('auth_token')?.slice(0, 20)}...</pre>
      <pre>User: {localStorage.getItem('user_data')}</pre>
    </div>
  );
}
