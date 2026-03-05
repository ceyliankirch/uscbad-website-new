'use client';
import React from 'react';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040817] font-['Montserrat'] pt-32 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </div>
  );
}