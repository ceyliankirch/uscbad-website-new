export default function robots() {
  // Remplacez cette URL par votre vrai nom de domaine une fois en ligne
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.uscreteilbadminton.com';

  return {
    rules: {
      userAgent: '*', // S'applique à tous les robots (Google, Bing, etc.)
      allow: '/', // Autorise l'exploration de tout le site public
      disallow: [
        '/admin/', // Bloque l'exploration du tableau de bord
        '/api/',   // Bloque l'exploration des routes API
        '/login'   // Pas besoin de référencer la page de connexion
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Indique où trouver le plan du site
  };
}