import db from '../db.mjs';

export default class UserController {
    // Получение всех пользователей
    static async getAllUsers(req, res) {
        try {
            if (!req.user?.is_admin) {
                return res.status(403).json({ error: 'Доступ запрещён' });
            }

            const users = await db.query('SELECT id, email, name, last_name, is_admin, created_at FROM users');
            res.json(users.rows);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    // Получение одного пользователя
    static async getUser(req, res) {
        const { id } = req.params;
        try {
            if (!req.user?.is_admin && parseInt(req.user?.id) !== parseInt(id)) {
                return res.status(403).json({ error: 'Доступ запрещён' });
            }

            const result = await db.query(
                'SELECT id, email, name, last_name, is_admin, created_at FROM users WHERE id = $1',
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }

            res.json(result.rows[0]);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }

    // Редактирование пользователя
    static async editUser(req, res) {
        try {
            const { id } = req.params;
            const { name, last_name, avatar_url } = req.body;

            const user = await db.query(
                `UPDATE users SET name = $1, last_name = $2, avatar_url = $3 WHERE id = $4 RETURNING *`,
                [name, last_name, avatar_url, id]
            );

            const { password_hash, ...userData } = user.rows[0];
            res.status(200).json(userData);
        } catch (e) {
            res.status(500).json({ message: "Ошибка при обновлении пользователя" });
        }
    }

    // Удаление пользователя
    static async removeUser(req, res) {
        const { id } = req.params;

        try {
            if (!req.user?.is_admin && parseInt(req.user?.id) !== parseInt(id)) {
                return res.status(403).json({ error: 'Доступ запрещён' });
            }

            const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);

            if (result.rows.length === 0) {
                return res.status(404).json({ error: 'Пользователь не найден' });
            }

            res.json({ message: 'Пользователь удалён', id: result.rows[0].id });
        } catch (error) {
            res.status(500).json({ error: 'Ошибка сервера' });
        }
    }
}
