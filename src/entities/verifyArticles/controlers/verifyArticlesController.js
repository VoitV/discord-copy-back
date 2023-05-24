import { db } from '../../../db/db.js'
 
export const getVerifyArticles = async (req,res) => {
    const sql = "SELECT * FROM VerifyArticles ORDER BY createdat DESC LIMIT 5";
    const articles = (await db.query(sql)).rows;
    res.json({articles})
}

export const getRandomVerifyArticles = async (req,res) => {
    let limit = parseInt(req.query.limit) || 10;

    if(limit < 0) {
        limit = 0;
    }
    if(limit > 50) {
        limit = 50;
    }
    const sql = "SELECT * FROM VerifyArticles ORDER BY RANDOM() LIMIT $1";
    const articles = (await db.query(sql,[limit])).rows;
    res.json({articles});
}

export const createVerifyArticle = async (req,res) => {
    const { articleTitle, articleType, articleContent } = req.body;
    console.log(articleTitle, articleContent, articleType);
    const sql = "insert into VerifyArticles (articletitle,articletype,articlecontent) VALUES ($1,$2,$3) RETURNING *"
    const article = (await db.query(sql,[articleTitle,articleType,articleContent])).rows;
    res.json({article});
}

export const getVerifyArticle = async (req,res) => {
    const { id } = req.params;
    const sql = "select * from VerifyArticles where id = $1 "
    const article = (await db.query(sql,[id])).rows[0];
    res.json(article);
}

export const getSameTypesArticle = async (req,res) => {
    const { articleType } = req.params;
    const sql = "select * from VerifyArticles where articleType = $1 "
    const articles = ((await db.query(sql,[articleType])).rows);
    res.json(articles);
}

export const getArticleBySearch = async (req,res) => {
    const { search } = req.query;
    const sql = `select * from VerifyArticles where articleTitle LIKE '%${search}%'`;
    const searchResult = (await db.query(sql)).rows;
    res.json(searchResult)
}

