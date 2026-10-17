"use client";

import { useState } from 'react';
import { loginAdmin } from '@/app/action';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    setError(''); // On réinitialise l'erreur
    const res = await loginAdmin(formData);
    
    if (res?.error) {
      setError(res.error);
    } else {
      router.push('/admin/dashboard'); // On redirige si succès
    }
  };

  return (
    <div className="min-h-screen bg-[#eaeff2] flex items-center justify-center font-sans">
      <div className="bg-white p-8 shadow-1xl w-full max-w-md border-t-4 border-[#002b6b]">
        
        <div className="flex flex-col items-center mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="https://i.imgur.com/z8yAfpK.png" alt="City Seal" className="w-20 h-20 mb-4 grayscale" />
          <h1 className="text-xl font-bold text-[#002b6b] text-center uppercase tracking-wide">
            ESPACE EMPLOYEUR
          </h1>
          <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest text-[10px]">ACCÈS RESTREINT</p>
        </div>

        <form action={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 text-sm font-bold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Identifiant</label>
            <input 
              name="username" 
              required 
              type="text" 
              className="w-full bg-gray-50 border border-gray-300 rounded p-3 outline-none focus:border-[#002b6b] focus:ring-1 focus:ring-[#002b6b] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Mot de passe</label>
            <input 
              name="password" 
              required 
              type="password" 
              className="w-full bg-gray-50 border border-gray-300 rounded p-3 outline-none focus:border-[#002b6b] focus:ring-1 focus:ring-[#002b6b] transition-all"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-[#002b6b] hover:bg-blue-900 text-white font-bold py-3 px-4 rounded shadow-lg transition-colors uppercase tracking-wider text-sm mt-4"
          >
            Se Connecter
          </button>
        </form>
      </div>
    </div>
  );
}