import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export const authOptions = {
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
      if (trigger === "update" && session?.user) {
        token.name = session.user.name;
        token.email = session.user.email;
        token.licence = session.user.licence;
        token.rankings = session.user.rankings;
      }
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
        token.licence = user.licence;
        token.rankings = user.rankings;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user && token?.id) {
        session.user.id = token.id;
        session.user.roles = token.roles || ['user'];
        session.user.licence = token.licence || '';
        session.user.rankings = token.rankings || { simple: 'NC', double: 'NC', mixte: 'NC' };
        delete session.user.image;
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
