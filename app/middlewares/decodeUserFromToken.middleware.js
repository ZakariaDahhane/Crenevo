import jwt from 'jsonwebtoken';

export function decodeUserFromToken (req, res, next){
    const token = req.cookies.auth_token;

    res.locals.userId = null;
    res.locals.userRole = null;
    res.locals.userEmail = null;

    if (!token){
        return next();
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.locals.userId = decoded.id;
        res.locals.userRole = decoded.role;
        res.locals.userEmail = decoded.email;

    } catch (error) {
        res.clearCookie('auth_token', { path : '/'});
    }

    return next();
}