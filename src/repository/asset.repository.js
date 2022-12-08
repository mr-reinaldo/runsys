import { prisma } from '../services/prisma.service.js';

// createAsset
export const createAsset = async (data) => {
    try {
        const asset = await prisma.asset.create({
            data: {
                host: data.host,
                port: data.port,
                username: data.username,
                password: data.password,
                userId: data.userId,
            },
        });

        return asset;
    } catch (error) {
        throw error;
    }
};

// readAllAssets
export const readAllAssets = async () => {
    try {
        const assets = await prisma.asset.findMany({
            select: {
                id: true,
                host: true,
                port: true,
                username: true,
                password: false,
                userId: true,
            },
        });

        return assets;
    } catch (error) {
        throw error;
    }
}

// readOneAsset
export const readOneAsset = async (id) => {
    try {
        const asset = await prisma.asset.findUnique({
            where: {
                id,
            },
            select: {
                id: true,
                host: true,
                port: true,
                username: true,
                password: true,
                userId: false,
            },
        });

        return asset;
    } catch (error) {
        throw error;
    }
}

// updateAsset
export const updateAsset = async (id, data) => {
    try {
        const asset = await prisma.asset.update({
            where: {
                id,
            },
            data: {
                host: data.host,
                port: data.port,
                username: data.username,
                password: data.password,
                userId: data.userId,
            },
        });

        return asset;
    } catch (error) {
        throw error;
    }
}

// deleteAsset
export const deleteAsset = async (id) => {
    try {
        const asset = await prisma.asset.delete({
            where: {
                id,
            },
        });

        return asset;
    } catch (error) {
        throw error;
    }
}

// readAllAssetsByUserId
export const readAllAssetsByUserId = async (userId) => {
    try {
        const assets = await prisma.asset.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                host: true,
                port: true,
                username: true,
                password: true,
                updatedAt: false,
                createdAt: false,
                userId: false,
            },
        });

        return assets;
    } catch (error) {
        throw error;
    }
}
