import db from '../../db/db.js';
import bcrypt from 'bcryptjs';
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

        const token = generateAcessToken(user.user_id);

        res.json(token);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Internal server error', errorCode: 500 });
    }
};


export const loginUser = async (req,res) => {
    const { email, password  } = req.body;

    const user = await db.select('*').from("user").where({email}).then(data=> data[0]);

    if(!user) {
        return res.status(400).json({message:'User not found',errorCode:400})
    }


    const validPassword = bcrypt.compareSync(password,user.password);

    if(!validPassword) {
        return res.status(400).json({message:'Passwornd is not valid',errorCode:400})
    }


    const token = generateAcessToken(user.user_id)

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

