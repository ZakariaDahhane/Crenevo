import Joi from "joi";
import { Reservation, Room } from "../models/index.js";
import { StatusCodes } from "http-status-codes";
import CoreController from "./core-controller.js";

const reservationSchema = Joi.object({
    subject: Joi.string()
      .trim()
      .min(10)
      .max(100)
      .required(),

    description: Joi.string()
      .trim()
      .max(2000)
      .allow(null, ''),

    start_at: Joi.date()
      .iso()
      .greater('now')
      .required(),

    end_at: Joi.date()
      .iso()
      .greater(Joi.ref('start_at'))
      .required(),

    participant_count: Joi.number()
      .integer()
      .min(1)
      .required(),

    room_id: Joi.number()
      .integer()
      .positive()
      .required(),
});

class ReservationController {

    showCreate = async (req, res) =>{
        try{

            const rooms = await Room.findAll({where: {active:true}, order: [['name', 'ASC'],]});
            

            const selectedRoomId = Number.parseInt(req.query.room_id, 10) || '';
            return res.status(StatusCodes.OK).render('reservations/create', {title:'Nouvelle Réservation', rooms, errorMessage: null, oldInput : {room_id: selectedRoomId}});

        } catch (error){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {message:'Aucune salle disponible' });
        }
    }
}

export default new ReservationController();