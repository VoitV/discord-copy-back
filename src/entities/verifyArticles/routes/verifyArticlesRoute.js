import { Router } from "express";
import { getVerifyArticles, createVerifyArticle, getVerifyArticle, getRandomVerifyArticles, getSameTypesArticle,getArticleBySearch } from '../controlers/verifyArticlesController.js';
import { handleErrorWrap } from "../../../middlewares/errorMiddleware.js";

export const verifyArticlesRouter = new Router();

verifyArticlesRouter.get('/articles',handleErrorWrap(getVerifyArticles));
verifyArticlesRouter.get('/articlesRandom', handleErrorWrap(getRandomVerifyArticles))
verifyArticlesRouter.post('/articles',handleErrorWrap(createVerifyArticle));
verifyArticlesRouter.get('/article/:id',handleErrorWrap(getVerifyArticle));
verifyArticlesRouter.get('/articles/same/:articleType',handleErrorWrap(getSameTypesArticle));
verifyArticlesRouter.get('/articles/search',handleErrorWrap(getArticleBySearch));
