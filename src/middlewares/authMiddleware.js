import jwt from 'jsonwebtoken'


const handleJWTAuth = (accessToken,req,res,next) => {
    const decodeData = jwt.decode(accessToken,'secret')

    req.user = decodeData;

    next();
}

export const authMiddleware = (req,res,next) => {


    const authHeaders = req.headers.authorization;



    if(!authHeaders) {
        res.status(401).json({message:'Unathorized'});
    }

    const [authType = '', accessToken = ''] = authHeaders.split(' ');
    
    if(!accessToken) {
        res.status(403).json({message:'User not found'})
    }

    if (authType.toLocaleLowerCase() === 'bearer') {
        return handleJWTAuth(accessToken, req,res, next);
    }

    next();
}