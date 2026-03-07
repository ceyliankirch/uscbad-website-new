import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Protection spécifique pour les routes /admin
    if (path.startsWith("/admin")) {
      // On récupère les rôles de l'utilisateur
      const roles = token?.roles || [];
      
      // Un "staff" est quelqu'un qui a un rôle différent du simple "user" 
      // (ex: admin, coach, buvette, cordeur...)
      const isStaff = roles.some(role => role !== 'user');

      // Si c'est un simple joueur (ou sans rôle spécial) qui essaie de forcer l'URL /admin
      if (!isStaff) {
        // On le renvoie poliment vers son espace joueur
        return NextResponse.redirect(new URL("/profil", req.url));
      }
    }
  },
  {
    callbacks: {
      // Cette fonction est la première ligne de défense :
      // S'il n'y a pas de token (utilisateur non connecté), NextAuth bloque l'accès
      // et peut le rediriger (la redirection par défaut se fait vers la page sign-in,
      // mais vous pouvez le forcer à retourner à la racine avec une modale si besoin).
      authorized: ({ token }) => !!token, 
    },
  }
);

// On définit ici les routes exactes qui DOIVENT déclencher ce middleware de sécurité
export const config = {
  matcher: [
    "/admin/:path*",      // Protège /admin et tous ses sous-dossiers (cordage, buvette, etc.)
    "/profil/:path*",     // Protège la page profil
    "/mes-indivs/:path*"  // Protège l'espace joueur (si elle existe encore)
  ]
};