import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getUserByEmail, verifyPassword } from '../../../lib/auth';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('🔵 Login attempt for:', credentials?.email);

        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing credentials');
          throw new Error('Please enter email and password');
        }

        try {
          const user = await getUserByEmail(credentials.email);
          
          console.log('🔍 User found:', user ? 'YES' : 'NO');

          if (!user) {
            console.log('❌ No user found with email:', credentials.email);
            throw new Error('No account found with this email. Please sign up first.');
          }

          const isValid = await verifyPassword(credentials.password, user.password);
          
          console.log('🔐 Password valid:', isValid);

          if (!isValid) {
            console.log('❌ Invalid password');
            throw new Error('Invalid password');
          }

          console.log('✅ Login successful for:', user.email);

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          };
        } catch (error: any) {
          console.error('❌ Authorization error:', error.message);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  debug: true, // Enable debug mode
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
