import jsonwebtoken from 'jsonwebtoken';
import { findUserByEmail } from '../repository/user.repository.js';
import bcrypt from 'bcrypt';

export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { id: userId, username: username, password: hash } = await findUserByEmail(email);

        const match = await bcrypt.compare(password, hash);

        if (match) {
            const token = jsonwebtoken.sign(
                { userId, username },
                process.env.SECRET_KEY,
                { expiresIn: 3600 } // 1h
            );

            res.json({ auth: true, token });
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(401).json({ error: 'User not found' });
    }
}