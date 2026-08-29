import { StatusCodes } from 'http-status-codes';



export function isManager(req, res, next) {
    if (req.userRole === 'manager') {
        return next();
    }

    return res.status(StatusCodes.FORBIDDEN).render('error', { title: 'Accès refusé',
        message: 'Accès refusé. Cette page est réservée aux gestionnaires.',
    });
}