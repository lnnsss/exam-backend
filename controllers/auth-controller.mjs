import bcrypt from 'bcryptjs';
import { validationResult } from 'express-validator';
import db from '../db.mjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export default class AuthController {
    // Регистрация
    static async registration(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ message: errors.array()[0].msg });
            }

            const { email, password, name, lastName, isAdmin } = req.body;

            const existingUser = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
            if (existingUser.rows.length) {
                return res.status(400).json({
                    message: "Пользователь с таким email уже зарегистрирован на сайте",
                });
            }

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);

            const user = await db.query(
                `INSERT INTO users (email, password_hash, name, last_name, is_admin) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
                [email, hash, name, lastName, isAdmin === true]
            );

            const token = jwt.sign(
                {
                    _id: user.rows[0].id,
                    is_admin: user.rows[0].is_admin,
                },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Убираем пароль из ответа
            const { password_hash, ...userData } = user.rows[0];

            res.status(200).json({
                message: "Успешная регистрация",
                token,
                user: userData,
            });
        } catch (error) {
            res.status(400).json({ message: "Ошибка регистрации", error });
        }
    }

    // Вход
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            const user = await db.query(`SELECT * FROM users WHERE email = $1`, [email]);
            if (!user.rows.length) {
                return res.status(404).json({ message: "Неверный логин или пароль" });
            }

            const isValidPassword = await bcrypt.compare(password, user.rows[0].password_hash);
            if (!isValidPassword) {
                return res.status(404).json({ message: "Неверный логин или пароль" });
            }

            const token = jwt.sign(
                {
                    _id: user.rows[0].id,
                    is_admin: user.rows[0].is_admin,
                },
                JWT_SECRET,
                { expiresIn: "24h" }
            );

            const { password_hash, ...userData } = user.rows[0];

            return res.status(200).json({
                message: "Успешный вход",
                token,
                user: userData,
            });
        } catch (err) {
            res.status(400).json({ message: "Ошибка при входе", err });
        }
    }
}
