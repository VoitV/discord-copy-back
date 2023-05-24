import express from "express"
import cors from 'cors';
import { verifyArticlesRouter } from "./entities/verifyArticles/routes/verifyArticlesRoute.js";
import bodyParser from 'body-parser';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/v1',verifyArticlesRouter);
app.use((err, req, res, next) => {
  console.log(err);
    res.status(500).send(err)
  })

app.listen(PORT,()=> {
    console.log('server star on ', PORT)
})