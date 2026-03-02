import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        // Le "Videur" vérifie si les identifiants correspondent à ton fichier .env.local
        if (
          credentials.email === process.env.ADMIN_EMAIL &&
          credentials.password === process.env.ADMIN_PASSWORD
        ) {
          // Succès ! On renvoie les infos de l'admin
          return { id: "1", name: "Admin USC", email: credentials.email };
        }
        // Échec ! On renvoie null
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt", // Utilise des tokens sécurisés
    maxAge: 24 * 60 * 60, // Déconnexion automatique après 24h
  },
  pages: {
    signIn: '/', // On dit à NextAuth de ne pas créer de page de login par défaut, on gère ça avec notre modale
  }
});

export { handler as GET, handler as POST };