import jwt from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { StatusCodes } from 'http-status-codes';
import User  from '../models/user.model.js';

//           REGISTER 

export async function register(req,res){

    const { last_name, first_name, email, password, confirmed_password} = req.body;

    if (!last_name || !first_name || !email || !password || !confirmed_password) {
        return res.status(StatusCodes.BAD_REQUEST).render('register',{error: 'Tous les champs sont requis'});
    }

    if(password !== confirmed_password){
        return res.status(StatusCodes.BAD_REQUEST).render('register',{error: 'Les mots de passe ne correspondent pas'});
    }

    if(password.length < 8 
        || !/[A-Z]/.test(password)
        || !/[0-9]/.test(password) 
        || !/[!@#$%^&*(),.?":{}|<>_\-+=]/.test(password)){
        return res.status(StatusCodes.BAD_REQUEST).render('register',{error: 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial'});
    }

    try{
        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({where:{email: normalizedEmail}});

        if(existingUser){
            return res.status(StatusCodes.CONFLICT).render('register',{error: 'Email déjà utilisé'});
        }

        const hash = await argon2.hash(password);

        const user = await User.create({
            last_name,
            first_name,
            email: normalizedEmail,
            password: hash,
            role: 'user',
        });

        res.redirect('/login');

    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('register',{error: 'Erreur serveur'});
    }
}

//           LOGIN

export async function login(req,res){

    const {email, password} = req.body;

    if (!email || !password){
        return res.status(StatusCodes.BAD_REQUEST).render('login',{error: 'Email ou mot de passe requis'});
    }

    try{
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({where:{ email: normalizedEmail }});

        if(!user){
            return res.status(StatusCodes.UNAUTHORIZED).render('login',{error: 'Email ou mot de passe incorrect'});
        }

        const hash = user.password;

        const ok = await argon2.verify(hash, password);

        if(!ok){
            return res.status(StatusCodes.UNAUTHORIZED).render('login',{error: 'Email ou mot de passe incorrect'});
        }

        if(!user.active){
            return res.status(StatusCodes.FORBIDDEN).render('login', {error: 'Votre compte est désactivé. Veuillez contacter l\'administrateur.'});
        }

        const token = jwt.sign(
            {
            id: user.id,
            role: user.role,
            },
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.cookie('auth_token', token, { 
            path:'/', 
            httpOnly: true, 
            sameSite: 'lax', 
            secure: process.env.NODE_ENV === 'production', 
            maxAge: 60 * 60 * 1000
        });

        return res.redirect('/');
 
    } catch (error) {
        console.error(error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('login',{error: 'Erreur serveur'});
    }

    
}

//          LOGOUT

export function logout(req,res){ 

    res.clearCookie('auth_token', { 
        path:'/',
        httpOnly: true,
        sameSite: 'lax', 
        secure: process.env.NODE_ENV === 'production'
    });

    res.redirect('/login');
}