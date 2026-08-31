import Joi from 'joi';
import { StatusCodes} from 'http-status-codes';
import { Room } from '../models/index.js';
import CoreController from './core-controller.js';

const roomSchema = Joi.object({
    name: Joi.string()
      .trim()
      .min(3)
      .max(50)
      .required(),

    building: Joi.string()
      .trim()
      .min(1)
      .max(50)
      .required(),

    floor: Joi.string()
      .trim()
      .min(1)
      .max(10)
      .allow(null, ''),

    capacity: Joi.number()
      .integer()
      .min(1)
      .required(),

    description: Joi.string()
      .trim()
      .allow(null, ''),

    image: Joi.string()
      .allow(null, '')
      .custom((value, helpers) => {

        if (!value || value ==='' ) return value;

        if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('/images/')){
            return value;
        }
    
     return helpers.message('L\'image doit être une URL valide ou un chemin vers /images/');
    }),    

    approval_required: Joi.boolean(),
})

class RoomController extends CoreController{
    constructor(){
        super(Room, roomSchema, 'rooms', '/rooms');
    }

    toggleActive = async (req,res) => {

      try{

      const { id } = req.params;

      const room = await Room.findByPk(id);

      if(!room){
        return res.status(StatusCodes.NOT_FOUND).render('error', {message: "Cette salle n'existe pas" });
      }

      await room.update({ active: !room.active});
       return res.redirect('/rooms');
    } catch (error){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error',{message: 'Impossible de modifier le statut de la salle'});
    }

    }

    getAll = async (req,res) => {

      try{
        const condition = req.userRole === 'manager' ? {} : {active: true};
        const rooms = await Room.findAll({where: condition});
        return res.status(StatusCodes.OK).render('rooms/list', {title: 'Liste des salles', items: rooms});
      } catch (error){
        return res.status(StatusCodes.INRERNAL_SERVER_ERROR).render('error',{message: 'Impossible de récupérer les salles'});
      }
    }

    getById = async(req,res) => {

      try{

       const { id } = req.params;
       const room = await Room.findByPk(id);

       if(!room){
        return res.status(StatusCodes.NOT_FOUND).render('error', {message: "Cette salle n'existe pas"});
       }

       if(!room.active && req.userRole !== 'manager'){
        return res.status(StatusCodes.NOT_FOUND).render('error', {message: "Cette salle n'est pas disponible"});
       }

       return res.status(StatusCodes.OK).render('rooms/detail', {title: room.name, item: room});
    } catch (error){
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error',{message: 'Impossible de consulter cette salle'});
    }
    }
}

export default new RoomController();