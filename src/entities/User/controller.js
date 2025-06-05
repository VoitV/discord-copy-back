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
    const imagesUrl = [
        'https://i.ibb.co/C3GnswPp/4.png',
        'https://i.ibb.co/Ps7V4xxd/3.png',
        'https://i.ibb.co/V6sJHjB/2.png',
        'https://i.ibb.co/Kc9FV2Sz/image.png'
    ]
    const { email, password, pseudonym} = req.body;


    try {
        const candidate = await db('user').where({ email}).orWhere({pseudonym}).first();


        if (candidate) {
            return res.status(409).json({ message: 'User Already exists', errorCode: 409 });
        }

        const hashPassword = bcrypt.hashSync(password, 5);


        // const user = await db('user').insert({
        //     email: email,
        //     password: hashPassword,
        //     avatar: imagesUrl[Math.floor(Math.random()*imagesUrl.length)],
        //     name: name,
        // }).returning('*').then(data=>data[0])
        //
        // const token = generateAcessToken(user.id);

        res.json('ok');
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


    // const validPassword = bcrypt.compareSync(password,user.password);
    //
    // if(!validPassword) {
    //     return res.status(400).json({message:'Passwornd is not valid',errorCode:400})
    // }


    const token = generateAcessToken(user.id)

    res.json(token)
}

export const getUser = async (req,res) => {

    const user_id = req.params.id;

    const user = await db.select('*').from('user').where({'id':user_id}).first();

    res.json(user)
}

export const getUsers = async (req,res) => {
    const users = await db.select('*').from("user").orderBy('id');

    res.json(users);
}

export const getUserFriend = async (req,res) => {
    const user = req.user;

    console.log(user);

    if(!user) {
        return res.status(400).json({message:'User not found',errorCode:400})
    }

    const user_friends_relation = await db.select('*')
        .from("user_friend")
        .where({user_one:user.id})
        .orWhere({user_two:user.id})

    const user_friends_id = [];

    user_friends_relation.forEach(userCheck => {
        if(userCheck.user_one === user.id && userCheck.user_two !== user.id) {
            user_friends_id.push(userCheck.user_two);
        }else {
            user_friends_id.push(userCheck.user_one);
        }
    })

    const user_friends = await db.select('*').from("user")
        .whereIn('id', user_friends_id)

    res.json(user_friends)
}

export const getUserServers = async(req,res) => {
    const user = req.user;

    if(!user) {
        return res.status(400).json({message:'User not found',errorCode:400})
    }

    const user_servers = await db.select('server.id', 'server.title', 'server.icon').from("server")
        .leftJoin('user_server', 'server.id', 'user_server.server_id')
        .where('user_server.user_id', user.id)

    res.json(user_servers);
}

export const addUserServer = async (req,res) => {
    const user = req.user;
    const {server_id} = req.body;

    if(!user) {
        return res.status(400).json({message:'User not found',errorCode:400})
    }

    const server = await db.select('*').from("server").where({'id':server_id}).first();

    if(!server) {
        return res.status(400).json({message:'Server not found',errorCode:400})
    }


    if(!server.is_public) {
        return res.status(400).json({message:'Server is private',errorCode:400})
    }

    const addedServer = await db("user_server").insert({
        server_id:server.id,
        user_id: user.id,
    }).returning("server_id");


    res.json(addedServer)
}

export const getUserChatMessages = async(req,res) => {
    const user_one = +req.user.id;
    const user_two = +req.params.user_id;

    const chat = await db.select('id').from("user_chat").where({user_one,user_two}).first();

    if(!chat) {
        const isFriends = await db("user_friend").where({user_one,user_two}).first();


        if(!isFriends) {
            return res.status(400).json({message:'Users not friends',errorCode:400})
        }

        const createdChat = await db("user_chat").insert({user_one, user_two});
    }

    const messages = await db
        .select(
            'user_chat_message.id',
            'user_chat_message.chat_id',
            'user_chat_message.user_id',
            'user_chat_message.message',
            'user_chat_message.created_at',
            'user.name',
            'user.pseudonym',
            'user.title_status',
            'user.online_status',
            'user.avatar'
        )
        .from('user_chat_message')
        .leftJoin('user', 'user.id', 'user_chat_message.user_id')
        .where({ chat_id: chat.id })
        .orderBy('user_chat_message.created_at', 'esc');


    res.json(messages)
}

export const addUserFriend = async (req, res) => {
    const user = req.user.id;
    const { pseudonym } = req.body;


    const candidate = await db.select('*').from('user').where({ pseudonym }).first();

    if (!candidate) {
        return res.status(404).json({ message: 'User not found', errorCode: 404 });
    }

    const isUserAlreadyFriend = await db
        .select('*')
        .from('user_friend')
        .where({ user_one: candidate.id, user_two: user })
        .orWhere({ user_one: user, user_two: candidate.id });

    if (isUserAlreadyFriend.length !== 0) {
        return res.status(400).json({ message: 'User is already in your friend list', errorCode: 400 });
    }


    const check_request = await db("user_friend_request")
        .select('*')
        .where({sender_id:user, receiver_id:candidate.id})
        .first();

    if(check_request) {
        return res.status(400).json({ message: 'Request already send', errorCode: 400 });
    }


    const request = await db("user_friend_request")
        .insert({ sender_id: user, receiver_id: candidate.id })
        .returning("*")

    res.json(request[0])
};


export const getFriendRequests = async (req, res) => {
    const user_id = req.user.id;


    const requestUsersIds = await db('user_friend_request')
        .pluck('sender_id')
        .where({ receiver_id: user_id });

    if (requestUsersIds.length === 0) {
        return [];
    }

    console.log(requestUsersIds)

    const requestUsers = await db('user')
        .select('*')
        .whereIn('id', requestUsersIds);

    res.json(requestUsers)

}





