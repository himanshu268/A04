import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/user";
require('dotenv').config();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });
      session.user.id = sessionUser._id.toString();
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();
        let userExist = await User.findOne({ email: profile.email });
        
        if (!userExist) {
          let baseUsername = profile.name.replace(/\s+/g, "").toLowerCase();
          let username = baseUsername;
          let usernameExists = await User.findOne({ username });

          // If username already exists, add a random number to the username
          while (usernameExists) {
            const randomNumber = Math.floor(Math.random() * 10000); // Generate a random number between 0 and 9999
            username = `${baseUsername}${randomNumber}`;
            usernameExists = await User.findOne({ username });
          }

          await User.create({
            email: profile.email,
            username: username,
            image: profile.picture,
          });
        } else {
          // Update existing user's info if necessary
          await User.updateOne(
            { email: profile.email },
            {
              $set: {
                username: userExist.username, // Keep existing username
                image: profile.picture,
              },
            }
          );
        }
        return true;
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error
          console.log("Duplicate key error:", error.message);
          return false; // Prevent sign-in if there's a duplicate key error
        } else {
          console.log("Sign-in error:", error);
          return false;
        }
      }
    },
  },
});

export { handler as GET, handler as POST };
