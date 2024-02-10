import { PrismaClient } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
    const password = await hash('test', 12)
    const user1 = await prisma.user.upsert({
        where: { email: 'admin@test.com' },
        update: {
            username: 'admin1',
        },
        create: {
            email: 'admin@test.com',
            name: 'Test Admin ',
            password: password,
            role: 'ADMIN',
        }
    })
    console.log({ user1 })
    const user2 = await prisma.user.upsert({
        where: { email: 'teacher@test.com' },
        update: {
            username: 'teacher1',
        },
        create: {
            email: 'teacher@test.com',
            name: 'Test Teacher ',
            password: password,
            role: 'TEACHER',
        }
    })
    console.log({ user2 })

    const user3 = await prisma.user.upsert({
        where: { email: 'jury@test.com' },
        update: {
            username: 'jury1',
        },
        create: {
            email: 'jury@test.com',
            name: 'Test jury ',
            password: password,
            role: 'JURY',
        }
    })
    console.log({ user3 })

    const user4 = await prisma.user.upsert({
        where: { email: 'school@test.com' },
        update: {
            username: 'school1',
        },
        create: {
            email: 'school@test.com',
            name: 'Test school ',
            password: password,
            role: 'SCHOOL',
        }
    })
    console.log({ user4 })
}
main()
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })