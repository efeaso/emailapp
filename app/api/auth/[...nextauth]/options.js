import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Access Key",
      credentials: {
        password: { label: "Access Key", type: "text" },
      },

      async authorize(credentials, req) {
        //   const result = await validateCode(credentials.password);

        //  console.log(result);

        if (credentials.password !== "solgambles307") {
          return null;
        }

        const user = {
          name: credentials.password,
        };

        //       localStorage.setItem("access_key", user.name);

        return user;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
