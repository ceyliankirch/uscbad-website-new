import { Montserrat } from 'next/font/google';
import './globals.css';

// 1. Configuration de la police Montserrat optimisée pour Next.js
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
  // Ajout du logo pour l'onglet
  icons: {
    icon: '/logo-uscbadminton.png', // Chemin vers votre logo dans le dossier /public
    shortcut: '/logo-uscbadminton.png',
    apple: '/logo-uscbadminton.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${montserrat.variable} font-sans antialiased bg-white dark:bg-[#040817] text-[#081031] dark:text-white transition-colors duration-300`}>
        
        {/* Vous pouvez insérer ici votre composant <Navbar /> 
          pour qu'il soit présent sur toutes les pages.
        */}
        
        <main>
          {children}
        </main>

        {/* Vous pouvez insérer ici votre composant <Footer /> 
        */}

      </body>
    </html>
  );
}