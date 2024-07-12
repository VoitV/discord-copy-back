import { Router } from "express";
import { createUser,
    loginUser,
    getUser, 
    getUsers
 } from "./controller.js";
import { handleErrorWrap } from "../../middlewares/errorMiddleware.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

export const userRouter = new Router();

userRouter.post('/create-user',handleErrorWrap(createUser));
userRouter.post('/login-user',handleErrorWrap(loginUser));
userRouter.get('/user',authMiddleware, handleErrorWrap(getUser));
userRouter.get('/users',handleErrorWrap(getUsers));