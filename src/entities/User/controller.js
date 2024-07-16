import db from '../../db/db.js';
import bcrypt from 'bcryptjs';
import { use } from 'chai';
import jwt from 'jsonwebtoken'

const generateAcessToken = (id) => {
    const payload = {
        id
    }
    return jwt.sign(payload, 'secret', {expiresIn: 60 * 60 * 24})
}

export const createUser = async (req, res) => {
    const { login, password } = req.body;


    try {
        const candidate = await db('user').where({ login }).first();


        if (candidate) {
            return res.status(409).json({ message: 'User Already exists', errorCode: 409 });
        }

        const hashPassword = bcrypt.hashSync(password, 5);

        const user = await db('user').insert({
            login: login,
            password: hashPassword
        }).returning('*').then(data=>data[0])

        const token = generateAcessToken(user.id);

        res.json(token);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', errorCode: 500 });
    }
};


export const loginUser = async (req,res) => {
    const { login, password  } = req.body;
    const user = await db.select('*').from("user").where({login}).then(data=> data[0]);

    if(!user) {
        return res.status(400).json({message:'User not found',errorCode:400})
    }


    const validPassword = bcrypt.compareSync(password,user.password);

    if(!validPassword) {
        return res.status(400).json({message:'Passwornd is not valid',errorCode:400})
    }


    const token = generateAcessToken(user.id)

    res.json(token)
}

export const getUser = async (req,res) => {

    if(!req.user) {
        return res.status(400).json({message:'User not found',errorCode:400})
    }

    const user_id = req.user.id;
    
    const user = await db.select('*').from("user").where({user_id}).then(data=>(data[0]))

    res.json(user)
}

export const getUsers = async (req,res) => {
    const users = await db.select('*').from("user");

    res.json(users);
}

export const getUserBalance = async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: 'User not found', errorCode: 400 });
    }

    const id = req.user.id;

    try {
        const user = await db.select('*').from("user").where({ id }).first();
        if (!user) {
            return res.status(404).json({ message: 'User not found', errorCode: 404 });
        }
        return user.balance;
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', errorCode: 500 });
    }
}

export const getUserBalanceSync = async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: 'User not found', errorCode: 400 });
    }

    const id = req.user.id;

    try {
        const user = await db.select('*').from("user").where({ id }).first();
        if (!user) {
            return res.status(404).json({ message: 'User not found', errorCode: 404 });
        }
        res.json(user.balance);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', errorCode: 500 });
    }
}

export const getUserIncome = async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: 'User not found', errorCode: 400 });
    }

    const id = req.user.id;

    try {
        const user = await db.select('*').from("user").where({ id }).first();
        if (!user) {
            return res.status(404).json({ message: 'User not found', errorCode: 404 });
        }
        return user.income;
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', errorCode: 500 });
    }
}

export const getUserGameInfo = async (req, res) => {
    try {
        const balancePromise = getUserBalance(req, res);
        const incomePromise = getUserIncome(req, res);

        const [balance, income] = await Promise.all([balancePromise, incomePromise]);

        if (typeof balance === 'number' && typeof income === 'number') {
            return res.json({ balance, income });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', errorCode: 500 });
    }
}

export const changeBalance = async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: 'User not found', errorCode: 400 });
    }

    const id = req.user.id;
    const { operation, number } = req.body;

    if (!operation || typeof number !== 'number') {
        return res.status(400).json({ message: 'Invalid operation or number', errorCode: 400 });
    }

    try {
        const userBalance = await getUserBalance(req, res);

        let newUserBalance;

        switch (operation) {
            case 'add':
                newUserBalance = userBalance + number;
                break;
            case 'subtract':
                newUserBalance = userBalance - number;
                break;
            default:
                return res.status(400).json({ message: 'Invalid operation', errorCode: 400 });
        }

        await db('user').where({ id }).update({ balance: newUserBalance });

        return res.json({ balance: newUserBalance });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', errorCode: 500 });
    }
}

