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

        if (operation === 'subtract' && userBalance - number <= 0) {
            console.log(userBalance)
            return res.status(402).json({ message: 'Insufficient balance', errorCode: 402 });
        }        

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

export const getBeesRaresList = async (req,res) => {
    res.json(await db.select('*').from('bee_rare'));
}

export const getBeePrice = async (req,res) => {
    const {id} = req.body;
    
    res.json(await db.select('price').from('bee_rare').where({id}))
}

export const getRandomBee= async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: 'User not found', errorCode: 400 });
    }

    const user_id = req.user.id;

    const { rare } = req.body;


    try {



        // Отримати всі бджоли цього рідкісного типу
        const beesInThisRare = await db.select(
            'bee_type.id as bee_type_id',
            'bee_type.type as bee_type',
            'bee_rare.id as bee_rare_id',
            'bee_rare.rare as bee_rare',
            'bee_type.isdefault as bee_type_is_default'
        )
        .from('bee_type')
        .join('bee_rare', 'bee_type.rare', 'bee_rare.id')
        .where('bee_rare.id', rare)
        .andWhere('bee_type.isdefault', true);


        if (beesInThisRare.length > 0) {
            const randomIndex = Math.floor(Math.random() * beesInThisRare.length);
            const beeTypeId = beesInThisRare[randomIndex].bee_type_id;
            
            const randomBee = await db('bee_type')
              .whereNot({ id: beeTypeId, isdefault:false }) // Вибираємо всі бджоли, крім однієї, що вже вибрана
              .orderByRaw('RANDOM()') // Використовуємо SQL-функцію для випадкового сортування
              .first(); // Вибираємо першу з випадкового списку
            
            const newUserBee = await db('bee').insert({ user_id, bee_type: randomBee.id }).returning('*');
            
            return res.json(newUserBee);
        } else {
            return res.status(400).json({ message: "No bees found for the given rare type", errorCode: 400 });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", errorCode: 500 });
    }
}


export const getUserBees = async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: 'User not found', errorCode: 400 });
    }

    const userId = req.user.id;

    try {
        const userBees = await db('bee')
            .leftJoin('bee_type', 'bee.bee_type', 'bee_type.id')
            .leftJoin('user', 'bee.user_id', 'user.id')
            .select('bee.id', 'bee.user_id', 'bee.bee_type', 'bee_type.type', 'bee_type.rare')
            .where('user.id', userId);

        res.json(userBees);
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', errorCode: 500 });
    }
};


export const getUserBee = async (req,res) => {
    if (!req.user) {
        return res.status(400).json({ message: 'User not found', errorCode: 400 });
    }

    const userId = req.user.id;
    const {beeId} = req.body;


    try {
        const userBee = await db('bee')
        .leftJoin('bee_type', 'bee.bee_type', 'bee_type.id')
        .leftJoin('user', 'bee.user_id', 'user.id')
        .select('bee.id', 'bee.user_id', 'bee.bee_type', 'bee_type.type', 'bee_type.rare')
        .where({
            'user.id': userId,
            'bee.id': beeId
        });
    
        res.json(userBee);
    } catch (err) {
        return res.status(500).json({ message: 'Internal server error', errorCode: 500 });
    }
}

export const upgradeUserBee = async (req, res) => {
    if (!req.user) {
        return res.status(400).json({ message: 'User not found', errorCode: 400 });
    }

    const userId = req.user.id;

    const { firstBeeId, secondBeeId } = req.body;


    const bees = await db('bee').select('*').join('bee_type','bee_type.id','bee_type').whereIn('bee.id', [firstBeeId, secondBeeId]);

    const firstBee = bees[0];
    const secondBee = bees[1];


    const createOrFindBee = async (type, rare) => {

        console.log(type,rare)

        const bee = await db('bee_type')
            .select('*')
            .where({ type, rare, isdefault: false })


        if (bee.length === 0) {
          return await db('bee_type')
           .insert({ type, rare, isdefault: false })
           .returning('*');
        }

        return bee;
    };

    const successUpgrade = async () => {
        const selectedBee = firstBee.type === secondBee.type ? firstBee : [firstBee, secondBee][Math.floor(Math.random() * 2)];
        const newBeeType = selectedBee.type;
        const newBeeRare = Math.min(selectedBee.rare + 1, 5);

        console.log(newBeeRare)

        return await createOrFindBee(newBeeType, newBeeRare);   
    };

    const randomMutation = async () => {
        if (Math.random() > 0.9) {
            return createOrFindBee('Пчола звичайна', 1);
        } else {
            return successUpgrade();
        }
    };

    let result;

    if (firstBee.rare === secondBee.rare) {
        if (Math.random() < 0.7) {
            result = await randomMutation();
            
        } else {
            result = 'failed upgrade';
        }
    } else {
        result = 'Bees rare mismatch';
    }

    if (result !== 'failed upgrade' && result !== 'Bees rare mismatch') {
        await db('bee')
            .where({ 'user_id': userId })
            .whereIn('bee.id', [firstBeeId, secondBeeId])
            .del();


    const beeTypeId = await db('bee_type').select('id').where({type:result[0].type, rare:result[0].rare, isdefault:false}).then(data=>data[0].id)

    const newUseBee = await db('bee').insert({user_id:userId, bee_type:beeTypeId}).returning('*')

    return res.status(200).json({newUseBee});
    }


    return res.status(200).json({ message: 'failed upgrade' });
};

