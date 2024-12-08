import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Access Key",
      credentials: {
        password: { label: "Access Key", type: "text" },
      },
      async authorize(credentials, req) {
        if (credentials.password !== "solgambles307") {
          return null;
        }

        return {
          id: "1", // Adding an id is required
          name: credentials.password,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login", // Specify custom login page
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
};
