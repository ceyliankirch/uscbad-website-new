import { Montserrat } from 'next/font/google';
import './globals.css';

// 1. Configuration de la police Montserrat optimisée pour Next.js
// Cela télécharge la police localement et règle définitivement le problème d'affichage sur iOS/Safari.
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat', // Définit une variable CSS pour Tailwind
  display: 'swap', // Affiche une police système en attendant le chargement (évite le texte invisible)
});

// 2. Métadonnées du site pour le SEO et l'affichage sur mobile
export const metadata = {
  title: 'US Créteil Badminton | Site Officiel',
  description: 'Découvrez le club de Badminton de Créteil : entraînements, école de jeunes labellisée, compétitions et vie du club.',
  keywords: ['badminton', 'Créteil', 'club', 'sport', 'jeunes', 'compétition'],
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className="scroll-smooth">
      {/* 3. Application de la police au body. 
        - 'montserrat.variable' injecte la variable CSS.
        - 'font-sans' (configuré dans tailwind.config.js) applique Montserrat par défaut.
        - 'antialiased' rend le texte plus lisse sur Mac et iOS.
      */}
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