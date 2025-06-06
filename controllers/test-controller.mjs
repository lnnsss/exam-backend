import db from '../db.mjs';

export default class TestController {
    // Получить тесты, созданные или пройденные пользователем
    static async getUserRelatedTests(req, res) {
        const userId = req.user?.id;
        const userEmail = req.user?.email;

        if (!userId || !userEmail) {
            return res.status(400).json({ error: 'Пользователь не авторизован' });
        }

        try {
            const result = await db.query(
                `
        SELECT DISTINCT ON (t.id)
          t.id,
          t.title,
          t.access_code,
          t.created_at,
          t.author_id,
          u.name AS author_name,
          u.last_name AS author_last_name
        FROM tests t
        LEFT JOIN users u ON t.author_id = u.id
        LEFT JOIN test_attempts ta ON ta.test_id = t.id
        WHERE t.author_id = $1 OR ta.user_email = $2
        ORDER BY t.id
        `,
                [userId, userEmail]
            );

            res.json(result.rows);
        } catch (e) {
            console.error(e);
            res.status(500).json({ error: 'Ошибка сервера при получении тестов' });
        }
    }
}
