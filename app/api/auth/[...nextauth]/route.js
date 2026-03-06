import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        
        if (user && user.password === credentials.password) {
          return { 
            id: user._id.toString(), 
            name: user.name, 
            email: user.email, 
            image: user.image,
            roles: user.roles && user.roles.length > 0 ? user.roles : (user.role ? [user.role] : ['user']),
            licence: user.licence || '',
            rankings: user.rankings || { simple: 'NC', double: 'NC', mixte: 'NC' }
          };
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // 1. Lors d'une mise à jour du profil depuis le front-end
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.image = session.user.image;
        token.licence = session.user.licence;
        token.rankings = session.user.rankings; // SAUVEGARDE DES CLASSEMENTS
      }
      
      // 2. Lors de la connexion initiale
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.licence = user.licence;
        token.rankings = user.rankings;
      }
      
      return token;
    },
    async session({ session, token }) {
      // 3. Construction de la session renvoyée au navigateur
      if (session?.user && token?.id) {
        session.user.id = token.id;
        session.user.roles = token.roles || ['user'];
        session.user.licence = token.licence || ''; 
        session.user.rankings = token.rankings || { simple: 'NC', double: 'NC', mixte: 'NC' };
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };