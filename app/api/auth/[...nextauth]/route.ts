import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";
import { compare } from 'bcrypt'
import { authOptions } from "@/app/auth/authOptions";

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }