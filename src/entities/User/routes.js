import { Router } from "express";
import {
    createUser,
    loginUser,
    getUser,
    getUsers,
    getUserFriend,
    getUserServers,
    addUserServer,
    getUserChatMessages,
    addUserFriend,
    getFriendRequests
} from "./controller.js";
import { handleErrorWrap } from "../../middlewares/errorMiddleware.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

export const userRouter = new Router();

/* ------------------------- Аутентифікація ------------------------- */
// Реєстрація нового користувача
userRouter.post('/signin', handleErrorWrap(createUser));
// Вхід користувача
userRouter.post('/login', handleErrorWrap(loginUser));

/* --------------------- Дані про користувачів --------------------- */
// Отримання всіх користувачів
userRouter.get('/users', handleErrorWrap(getUsers));
// Отримання користувача за ID
userRouter.get('/users/:id', handleErrorWrap(getUser));

/* -------------------- Друзі користувача -------------------- */
// Отримання друзів поточного користувача
userRouter.get('/user-friends', authMiddleware, handleErrorWrap(getUserFriend));
// Додати друга користувачу
userRouter.post('/user/add', authMiddleware, handleErrorWrap(addUserFriend));
// Отримати список реквестів на дружбу
userRouter.get('/user/requests',authMiddleware,handleErrorWrap(getFriendRequests))

/* ---------------------- Сервери користувача ---------------------- */
// Отримання серверів поточного користувача
userRouter.get('/user/servers', authMiddleware, handleErrorWrap(getUserServers));
// Додати сервер користувачу
userRouter.post('/user/add-server', authMiddleware, handleErrorWrap(addUserServer));

/* ---------------------- Повідомлення користувача ---------------------- */
// Отримання повідомлень користувача
userRouter.get('/user/message/:user_id', authMiddleware, handleErrorWrap(getUserChatMessages));
