import { createUser, readAllUsers, findUserById, upadateUser, deleteUser } from "../repository/user.repository.js";
import bcrypt from "bcrypt";


export const insertUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        // Check if user already exists

        const userExists = await findUserById(email);

        if (userExists) {
            return res.status(400).json({
                success: false,
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
            success: true,
            message: "User created successfully",
            user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
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
        const { userId } = req.params;

        const user = await findUserById(userId);

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
        const { userId } = req.params;
        const { username, email, previousPassword, newPassword } = req.body;

        const user = await findUserById(String(userId));

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(previousPassword, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Password is incorrect",
                status: "error",
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, Number(process.env.SALT_ROUNDS));

        const updatedUser = await upadateUser(String(userId), {
            username,
            email,
            password: hashedPassword,
        });

        return res.status(200).json({
            message: "User updated successfully",
            status: "success",
            updatedUser,
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
        const { userId } = req.params;

        const user = await findUserById(String(userId));

        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: "error",
            });
        }

        await deleteUser(String(userId));

        return res.status(200).json({
            message: "User deleted successfully",
            status: "success",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message,
        });
    }
}

