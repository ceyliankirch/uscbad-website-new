export default async function sitemap() {
  // Remplacez cette URL par votre vrai nom de domaine une fois en ligne
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.uscreteilbadminton.com';

  // 1. Liste de vos pages statiques principales
  const staticRoutes = [
    '', // Accueil
    '/presentation',
    '/actualites',
    '/inscriptions',
    '/creneaux',
    '/interclubs',
    '/jeunes',
    '/pole-feminines',
    '/indivs',
    '/evenements'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    // On dit à Google à quelle fréquence la page change
    changeFrequency: route === '' || route === '/actualites' ? 'daily' : 'weekly',
    // Priorité de 0.0 à 1.0 (L'accueil est la plus importante)
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. (Optionnel) Récupération dynamique de vos articles d'actualité
  // Si vous avez beaucoup d'articles, cela permet à Google de les indexer automatiquement.
  let dynamicRoutes = [];
  try {
    // Note: Mettez l'URL absolue de votre API si appelé côté serveur en production
    const res = await fetch(`${baseUrl}/api/articles`);
    const data = await res.json();
    
    if (data.success) {
      dynamicRoutes = data.data.map((article) => ({
        url: `${baseUrl}/actualites/${article._id}`,
        lastModified: new Date(article.updatedAt || article.createdAt).toISOString(),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error("Erreur lors de la génération du sitemap pour les articles:", error);
  }

  // On combine les pages fixes et les pages d'articles
  return [...staticRoutes, ...dynamicRoutes];
}