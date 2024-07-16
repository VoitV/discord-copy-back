import { Router } from "express";
import { createUser,
    loginUser,
    getUser, 
    getUsers,
    getUserBalance,
    getUserGameInfo,
    changeBalance,
    getUserBalanceSync
 } from "./controller.js";
import { handleErrorWrap } from "../../middlewares/errorMiddleware.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

export const userRouter = new Router();

userRouter.post('/create-user',handleErrorWrap(createUser));
userRouter.post('/login',handleErrorWrap(loginUser));
userRouter.get('/user',authMiddleware, handleErrorWrap(getUser));
userRouter.get('/users',handleErrorWrap(getUsers));
userRouter.get('/balance',authMiddleware, handleErrorWrap(getUserBalanceSync));
userRouter.get('/game-info',authMiddleware,handleErrorWrap(getUserGameInfo));
userRouter.patch('/balance-change',authMiddleware,handleErrorWrap(changeBalance));