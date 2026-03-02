'use client'; // <-- INDISPENSABLE pour utiliser useState
import React, { useState } from 'react';
import './globals.css'; 
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import { usePathname } from 'next/navigation';

export default function RootLayout({ children }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const pathname = usePathname();

  // On ne veut pas de Navbar/Footer sur les pages admin
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <html lang="fr">
      <body className="antialiased bg-white min-h-screen flex flex-col">
        
        {/* On n'affiche la Navbar que si on n'est pas sur une page admin */}
        {!isAdminPage && (
          <Navbar onOpenAuth={() => setIsAuthOpen(true)} />
        )}
        
        <main className="flex-grow">
          {children}
        </main>
        
        {!isAdminPage && <Footer />}

        {/* La modale s'affiche par-dessus tout le site */}
        {isAuthOpen && (
          <AuthModal onClose={() => setIsAuthOpen(false)} />
        )}
      </body>
    </html>
  );
}