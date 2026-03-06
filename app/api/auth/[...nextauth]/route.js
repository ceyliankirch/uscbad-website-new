import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        console.log("1. Tentative de connexion avec:", credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log("2. Erreur: Email ou mot de passe manquant");
          return null;
        }

        try {
          await dbConnect();
          console.log("3. Base de données connectée");
          
          const user = await User.findOne({ email: credentials.email });
          console.log("4. Utilisateur trouvé en base:", user ? "Oui" : "Non");

          if (user && user.password === credentials.password) {
            console.log("5. Mot de passe correct. Connexion acceptée.");
            // On s'assure de renvoyer l'ID sous forme de chaîne de caractères
            return { 
              id: user._id.toString(), 
              name: user.name, 
              email: user.email, 
              roles: user.roles && user.roles.length > 0 ? user.roles : (user.role ? [user.role] : ['user']) // Rétrocompatibilité
            };
          }

          console.log("6. Erreur: Mot de passe incorrect");
          return null;
        } catch (error) {
          console.error("Erreur lors de l'authentification :", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. MISE À JOUR DEPUIS LA PAGE PROFIL
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
        // On ne met pas l'image dans le token pour éviter l'erreur 431
      }

      // 2. LORS DE LA CONNEXION (Premier appel, "user" est défini)
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
      }
      
      return token;
    },
    
    async session({ session, token }) {
      // 3. CONSTRUCTION DE LA SESSION POUR LE CLIENT
      if (session?.user && token?.id) {
        session.user.id = token.id;
        session.user.roles = token.roles || ['user'];
        
        try {
          // On va chercher l'image fraîche depuis la base de données
          // Cela permet d'avoir toujours la dernière image sans alourdir le cookie (token)
          await dbConnect();
          const userDb = await User.findById(token.id).select('image');
          session.user.image = userDb?.image || null;
        } catch (error) {
          console.error("Erreur lors de la récupération de l'image de profil :", error);
          session.user.image = null;
        }
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login', // Force NextAuth à renvoyer les erreurs vers TA page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // Force la durée à 30 jours
  },
  secret: process.env.NEXTAUTH_SECRET || "une_cle_secrete_de_secours_si_env_manquant", // Sécurité anti-crash
  debug: process.env.NODE_ENV === 'development', // Affiche les vraies erreurs dans ton terminal
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };