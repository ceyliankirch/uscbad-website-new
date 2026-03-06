'use client';
import React from 'react';

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040817] font-['Montserrat'] pt-32 pb-12 transition-colors duration-300">
      {/* On utilise des marges responsives (px-6 sur mobile, px-12 sur PC, px-20 sur très grand écran) 
        pour que le menu de navigation et le contenu central respirent beaucoup plus.
      */}
      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 mx-auto max-w-[1800px]">
        {children}
      </div>
    </div>
  );
}