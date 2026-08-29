import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';

export function authenticateToken (req, res, next){
    const token = req.cookies.auth_token;

    if(!token){
        return res.redirect('/login');
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;
        req.userRole = decoded.role;

        return next();

    } catch (error){
        console.error('JWT invalide ou expiré:', error);
        res.clearCookie('auth_token', { path: '/'});
        return res.status(StatusCodes.UNAUTHORIZED).render('login', {title: 'Connexion', error: 'Session expiré'});
    }

}