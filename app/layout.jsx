import { Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from './components/Navbar'; 
import Footer from './components/Footer'; 
import AuthProvider from './components/AuthProvider';

// 1. Configuration de la police Montserrat optimisée pour Next.js
// Cela règle définitivement le problème d'affichage (Times New Roman) sur iOS/Safari.
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

// 2. Métadonnées du site incluant le logo pour l'onglet (Favicon)
export const metadata = {
  title: 'US Créteil Badminton | Site Officiel',
  description: 'Découvrez le club de Badminton de Créteil : entraînements, école de jeunes labellisée, compétitions et vie du club.',
  keywords: ['badminton', 'Créteil', 'club', 'sport', 'jeunes', 'compétition'],
  icons: {
    icon: '/logo-uscbadminton.png',
    shortcut: '/logo-uscbadminton.png',
    apple: '/assets/ios-logo-uscbad.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${montserrat.variable} font-sans antialiased bg-white dark:bg-[#040817] text-[#081031] dark:text-white transition-colors duration-300`}>
        <AuthProvider>  
          <Navbar />         
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}