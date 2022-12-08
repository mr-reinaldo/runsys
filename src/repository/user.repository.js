import { prisma } from '../services/prisma.service.js';


export const createUser = async (data) => {
    try {
        // verify if user already exists.
        const userExists = await prisma.user.findUnique({
            where: {
                email: data.email,
            },
        });

        if (userExists) {
            throw new Error('User already exists');
        }

        const user = await prisma.user.create({
            data,
        });

        return user;
    } catch (error) {
        throw error;
    }
};

export const readAllUsers = async () => {
    try {
        const users = await prisma.user.findMany(
            {
                select: {
                    id: true,
                    username: true,
                    email: true,
                },
            },
        );

        return users;
    } catch (error) {
        throw error;
    }
};

export const upadateUser = async (id, data) => {
    try {
        const user = await prisma.user.update({
            where: {
                id,
            },
            data,
        });

        return user;
    } catch (error) {
        throw error;
    }
};


export const deleteUser = async (id) => {
    try {
        const user = await prisma.user.delete({
            where: {
                id,
            },
        });

        return user;
    } catch (error) {
        throw error;
    }
};


export const findUserByEmail = async (email) => {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
}

export const findUserById = async (id) => {
    return prisma.user.findUnique({
        where: {
            id,
        },
    });
}