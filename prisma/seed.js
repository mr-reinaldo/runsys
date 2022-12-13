import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt";

const prisma = new PrismaClient()

async function main() {
    const runsys = await prisma.user.create({
        data: {
            username: 'admin',
            email: 'admin@runsys.com',
            password: await bcrypt.hash(process.env.ADMIN_PASSWORD, Number(process.env.SALT_ROUNDS))
        }
    });

    console.log(runsys);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
