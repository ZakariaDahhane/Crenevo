import jwt from 'jsonwebtoken';

export function decodeUserFromToken (req, res, next){
    

    res.locals.userId = null;
    res.locals.userRole = null;
    res.locals.userEmail = null;

    req.userId = null;
    req.userRole = null;
    const token = req.cookies.auth_token;

    if (!token){
        return next();
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;
        req.userRole = decoded.role;

        res.locals.userId = decoded.id;
        res.locals.userRole = decoded.role;
        res.locals.userEmail = decoded.email;

    } catch (error) {
        res.clearCookie('auth_token', { path : '/'});
    }

    return next();
}