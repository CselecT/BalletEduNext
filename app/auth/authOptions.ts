import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/prisma/client";
import { compare } from 'bcrypt'

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
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
                    randomKey: 'Hey cool',
                    schoolId: user.schoolId,
                    juryId: user.juryId
                }
            }
        })
    ], callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role
                token.schoolId = user.schoolId
                token.juryId = user.juryId
            }
            return token
        },
        // If you want to use the role in client components
        async session({ session, token }) {
            if (session?.user) {
                session.user.role = token.role
                session.user.schoolId = token.schoolId
                session.user.juryId = token.juryId
            }
            return session
        },
    }
};