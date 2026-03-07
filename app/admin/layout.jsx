'use client';
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Si la session est en cours de chargement, on ne fait rien
    if (status === 'loading') return;

    // Si l'utilisateur n'est pas connecté du tout, on le renvoie à l'accueil
    if (status === 'unauthenticated') {
      router.replace('/');
      return;
    }

    // Si l'utilisateur est connecté, on vérifie ses rôles
    if (status === 'authenticated') {
      const roles = session?.user?.roles || (session?.user?.role ? [session.user.role] : ['user']);
      
      // Un "staff" est quelqu'un qui a au moins un rôle différent de "user"
      const isStaff = roles.some(role => role !== 'user');

      if (!isStaff) {
        // Redirection polie vers son espace personnel
        router.replace('/profil');
      } else {
        // L'utilisateur a les droits, on affiche la page
        setIsAuthorized(true);
      }
    }
  }, [status, session, router]);

  // Écran de chargement pendant la vérification des droits
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#040817] flex flex-col items-center justify-center gap-4 transition-colors duration-300">
        <Loader2 className="animate-spin text-[#0065FF]" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Vérification des accès...</p>
      </div>
    );
  }

  // Si tout est bon, on affiche le contenu normal de l'admin
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#040817] font-['Montserrat'] pt-32 pb-12 transition-colors duration-300">
      <div className="w-full px-6 md:px-12 lg:px-16 xl:px-20 mx-auto max-w-[1800px]">
        {children}
      </div>
    </div>
  );
}