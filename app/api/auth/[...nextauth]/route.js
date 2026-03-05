import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          await dbConnect();
          const user = await User.findOne({ email: credentials.email });

          if (user && user.password === credentials.password) {
            return { 
              id: user._id.toString(), 
              name: user.name, 
              email: user.email, 
              role: user.role,
              image: user.image // <-- 1. ON RÉCUPÈRE L'IMAGE DE LA BDD
            };
          }

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
      // <-- 2. GESTION DE LA MISE À JOUR (Quand on clique sur Enregistrer)
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.image = session.user.image; // On met à jour l'image dans le token
      }

      // <-- 3. LORS DE LA CONNEXION INITIALE
      if (user) {
        token.role = user.role;
        token.id = user.id;
        token.image = user.image; // On injecte l'image dans le token
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.image = token.image; // <-- 4. ON EXPOSE L'IMAGE DANS LA SESSION
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };