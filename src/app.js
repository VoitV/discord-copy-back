import express from "express";
import cors from 'cors';
import bodyParser from 'body-parser';
import { userRouter } from "./entities/User/routes.js";

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



app.use('/api/v1', userRouter);


app.listen(PORT, () => {
    console.log('Server started on port', PORT);
});

export default app;
