import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";
import { compare } from 'bcrypt'


const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'Sign in',
            credentials: {
                username: {
                    label: 'User Name',
                    type: 'username',
                    placeholder: 'user.name'
                },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials.password) {
                    return null
                }
                const user = await prisma.user.findUnique({
                    where: {
                        username: credentials.username
                    }
                })
                if (!user) {
                    return null
                }
                const isPasswordValid = await compare(
                    credentials.password,
                    user.password
                )
                if (!isPasswordValid) {
                    return null
                }
                return {
                    id: user.id + '',
                    email: user.email,
                    name: user.name,
                    role: user.role ?? 'user',
                    randomKey: 'Hey cool'
                }
            }
        })
    ], callbacks: {
        async session({ session, token, user }) {
            session.user.role = user.role
            return session
        },
    }
})

export { handler as GET, handler as POST }