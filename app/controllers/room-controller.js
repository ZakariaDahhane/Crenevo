import Joi from 'joi';
import { Room } from '../models/index.js';
import CoreController from './core-controller.js';

const roomSchema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(50)
      .required(),

    building: Joi.string()
      .min(1)
      .max(50)
      .required(),

    floor: Joi.string()
      .min(1)
      .max(10)
      .allow(null, ''),

    capacity: Joi.number()
      .integer()
      .min(1)
      .required(),

    description: Joi.string()
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
}

export default new RoomController();