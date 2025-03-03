import NextAuth from "next-auth"
import { cookies } from "next/headers"
import CredentialsProvider from "next-auth/providers/credentials"

const authOptions = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt'
  },
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
        // The name to display on the sign in form (e.g. 'Sign in with...')
        name: 'Credentials',
        // The credentials is used to generate a suitable form on the sign in page.
        // You can specify whatever fields you are expecting to be submitted.
        // e.g. domain, username, password, 2FA token, etc.
        // You can pass any HTML attribute to the <input> tag through the object.
        credentials: {
          username: { label: "Username", type: "text", placeholder: "jsmith" },
          password: { label: "Password", type: "password" }
        },
        async authorize(credentials, req) {
          // You need to provide your own logic here that takes the credentials
          // submitted and returns either a object representing a user or value
          // that is false/null if the credentials are invalid.
          // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
          // You can also use the `req` object to obtain additional parameters
          // (i.e., the request IP address)
          const username = credentials?.username
          const password = credentials?.password
          const res = await fetch(`${process.env.API_URL}/user/Authenticate`, {
            method: 'POST',
            body: JSON.stringify({ username, password}),
            headers: { "Content-Type": "application/json" },
            credentials: 'include',
          }).catch((error) => {
            console.error(error)
            return error
          });
          const user = await res.json()
          // If no error and we have user data, return it
          if (res.ok && user) {
            const cookieStore = await cookies();
            cookieStore.set('token', user.token, { secure: true });
            return user
          }
          // Return null if user data could not be retrieved
          return null
        }
      })
  ],
  callbacks: {
    async jwt({ token, user }) {
      const username = (user as any)?.username;
      if(username){
        token.username = (user as any)?.username
      }      
      return token
    },
    session({ session, token }) {
      if(token.username && session.user){
        session.user.name =  token.username.toString()
      }
      return session
    },
  },
})
 
export { authOptions as GET, authOptions as POST }