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
          // 1. Connexion à la base de données
          await dbConnect();

          // 2. Recherche de l'utilisateur réel par son email
          const user = await User.findOne({ email: credentials.email });

          // 3. Vérification si l'utilisateur existe et si le mot de passe correspond
          // NOTE : Si vous utilisez bcrypt pour hasher les mots de passe à la création,
          // il faudra utiliser bcrypt.compare(credentials.password, user.password) ici.
          if (user && user.password === credentials.password) {
            // On retourne l'objet utilisateur qui sera stocké dans le token JWT
            return { 
              id: user._id.toString(), 
              name: user.name, 
              email: user.email, 
              role: user.role 
            };
          }

          // Si les identifiants ne correspondent pas
          return null;
        } catch (error) {
          console.error("Erreur lors de l'authentification :", error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    // On injecte les informations (ID et Rôle) dans le token JWT
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    // On rend ces informations accessibles dans la session (Navbar, Dashboards)
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // Redirige vers votre belle page de login personnalisée
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };