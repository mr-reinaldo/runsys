import { createAsset, readAllAssets, updateAsset, deleteAsset, readAllAssetsByUserId, readOneAsset } from "../repository/asset.repository.js";
import cryptojs from "crypto-js";


export const insertAsset = async (req, res) => {
    try {
        const { host, port, username, password, userId } = req.body;

        // Encrypt password
        const encryptedPassword = cryptojs.AES.encrypt(password, process.env.SECRET_KEY_AES).toString();

        const asset = await createAsset({
            host,
            port,
            username,
            password: encryptedPassword,
            userId,
        });

        res.status(201).json({
            message: "Asset created successfully",
            status: "success",
            asset,
        });


    } catch (error) {
        res.status(500).json({
            message: "Error creating asset",
            status: "error",
            error,
        });
    }

}

export const getAllAssets = async (req, res) => {
    try {
        const assets = await readAllAssets();

        res.status(200).json({
            message: "Assets fetched successfully",
            assets,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching assets",
            error,
        });
    }
}

export const getOneAsset = async (req, res) => {
    try {
        const { assetId } = req.params;

        const asset = await readOneAsset(assetId);

        res.status(200).json({
            message: "Asset fetched successfully",
            asset,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching asset",
            error,
        });
    }
}

export const updateOneAsset = async (req, res) => {
    try {
        const { assetId } = req.params;
        const { host, port, username, password, userId } = req.body;

        // Encrypt password
        const encryptedPassword = cryptojs.AES.encrypt(password, process.env.SECRET_KEY_AES).toString();

        const asset = await updateAsset(assetId, {
            host,
            port,
            username,
            password: encryptedPassword,
            userId,
        });

        res.status(200).json({
            message: "Asset updated successfully",
            asset,
            status: "success"
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating asset",
            error,
            status: "error"
        });
    }
}

export const deleteOneAsset = async (req, res) => {
    try {
        const { assetId } = req.params;

        await deleteAsset(assetId);

        res.status(200).json({
            message: "Asset deleted successfully",
            status: "success"
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting asset",
            error,
        });
    }
}


export const getAllAssetsByUserId = async (req, res) => {
    try {
        const { id } = req.params;

        const assets = await readAllAssetsByUserId(id);

        res.status(200).json({
            message: "Assets fetched successfully",
            assets,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching assets",
            error,
        });
    }
}