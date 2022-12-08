import { createUser, readAllUsers, findUserById, upadateUser, deleteUser } from "../repository/user.repository.js";
import bcrypt from "bcrypt";

export const insertUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists

        const userExists = await findUserById(email);

        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
            });

        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

        const user = await createUser({
            username,
            email,
            password: hashedPassword,
        });

        return res.status(201).json({
            message: "User created successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await readAllUsers();

        return res.status(200).json({
            message: "Users fetched successfully",
            users,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
}

export const getOneUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await findUserById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        return res.status(200).json({
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
}

export const editUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;

        const user = await findUserById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));

        const updatedUser = await upadateUser(id, {
            username,
            email,
            password: hashedPassword,
        });

        return res.status(200).json({
            message: "User updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
}

export const removeUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await findUserById(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        await deleteUser(id);

        return res.status(200).json({
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
}

