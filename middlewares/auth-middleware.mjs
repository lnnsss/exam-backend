import { body } from "express-validator";

export const registerValidation = [
    body("email")
        .isEmail()
        .withMessage("Неверный формат электронной почты")
        .not()
        .contains(" ")
        .withMessage("Электронная почта не должна содержать пробелов"),

    body("password")
        .isLength({ min: 6 })
        .withMessage("Пароль должен содержать не меньше 6 символов")
        .matches(/[a-z]/)
        .withMessage("Пароль должен содержать строчные буквы")
        .matches(/[A-Z]/)
        .withMessage("Пароль должен содержать заглавные буквы")
        .matches(/[!#$%&?]/)
        .withMessage("Пароль должен содержать специальные символы (! # $ % & ?)")
        .not()
        .matches(/[а-яА-Я]/)
        .withMessage("Пароль не должен содержать русские буквы")
        .not()
        .contains(" ")
        .withMessage("Пароль не должен содержать пробелов"),

    body("name")
        .isAlpha("ru-RU")
        .withMessage("Имя должно содержать только русские буквы")
        .isLength({ max: 14 })
        .withMessage("Имя не должно быть длиннее 14 символов"),

    body("lastName")
        .isAlpha("ru-RU")
        .withMessage("Фамилия должна содержать только русские буквы")
        .isLength({ max: 20 })
        .withMessage("Фамилия не должна быть длиннее 20 символов"),
];