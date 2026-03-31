import { Montserrat } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar'; 
import Footer from '@/components/Footer'; 
import AuthProvider from '@/components/AuthProvider';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
});

// Métadonnées du site incluant le logo pour l'onglet (Favicon) et l'Open Graph
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://www.uscbad.fr'),
  title: 'US Créteil Badminton | Site Officiel',
  description: 'Découvrez le club de Badminton de Créteil : entraînements, école de jeunes labellisée, compétitions et vie du club.',
  keywords: ['badminton', 'Créteil', 'club', 'sport', 'jeunes', 'compétition', 'USC', 'Val-de-Marne'],
  icons: {
    icon: '/logo-uscbadminton.png',
    shortcut: '/logo-uscbadminton.png',
    apple: '/logo-uscbadminton.png',
  },
  openGraph: {
    title: 'US Créteil Badminton',
    description: 'Le club de badminton de Créteil. Rejoignez-nous pour la compétition ou le loisir !',
    url: 'https://www.uscreteilbadminton.com',
    siteName: 'US Créteil Badminton',
    images: [
      {
        url: '/assets/banniere-uscbad-16-9.jpg', // L'image qui s'affichera lors du partage de lien
        width: 1200,
        height: 630,
        alt: 'US Créteil Badminton',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${montserrat.variable} font-sans antialiased bg-white dark:bg-[#040817] text-[#081031] dark:text-white transition-colors duration-300`}>
        
        {/* <-- 2. ON ENVELOPPE TOUTE L'APPLICATION ICI --> */}
        <AuthProvider>
          {/* Barre de navigation présente sur tout le site */}
          <Navbar />
          
          <main className="min-h-screen">
            {children}
          </main>

          {/* Pied de page présent sur tout le site */}
          <Footer />
        </AuthProvider>

      </body>
    </html>
  );
}