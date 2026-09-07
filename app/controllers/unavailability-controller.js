import Joi from 'joi';
import { Op } from 'sequelize';
import { StatusCodes} from 'http-status-codes';
import { Unavailability, Reservation, Room, User } from '../models/index.js';

const unavailabilitySchema = Joi.object({
    room_id: Joi.number()
      .integer()
      .positive()
      .required(),

    start_at: Joi.date()
      .iso()
      .greater('now')
      .required(),

    end_at: Joi.date()
      .iso()
      .greater(Joi.ref('start_at'))
      .required(),

    reason: Joi.string()
      .trim()
      .min(5)
      .max(1000)
      .required(),
})

class UnavailabilityController {
    getAll = async (req,res) => {
        try{
            const unavailabilities = await Unavailability.findAll({
                include: [
                    { model: Room, as: 'room' },
                    { model: User, as: 'manager', attributes: ['id', 'first_name', 'last_name', 'email'] }
                ],
                order: [['start_at', 'ASC']]
            });

            return res.status(StatusCodes.OK).render('unavailabilities/list', {unavailabilities});

        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {message:'Impossible de récupérer les indisponibilités' });
        }
    }

    showCreate = async (req,res) => {
        try{
            const rooms = await Room.findAll({where: {active:true}, order: [['name', 'ASC'],]});

            const SelectedRoomId = Number.parseInt(req.query.room_id, 10) || '';

            return res.status(StatusCodes.OK).render('unavailabilities/create', {rooms, errorMessage: null, oldInput : {room_id: SelectedRoomId}});

        } catch (error){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {message:'Aucune salle disponible' });
        }
    }

    createUnavailability = async (req,res) => {
        try{
            const { error, value } = unavailabilitySchema.validate(req.body, { abortEarly: false });

            if (error) {
                const rooms = await Room.findAll({where: {active:true}, order: [['name', 'ASC'],]});
                return res.status(StatusCodes.BAD_REQUEST).render('unavailabilities/create', {rooms, errorMessage: error.details[0].message, oldInput: req.body});
            }

            const room = await Room.findByPk(value.room_id);
            if(!room || !room.active) {
                const rooms = await Room.findAll({where:{active:true}, order:[['name','ASC']]});
                return res.status(StatusCodes.BAD_REQUEST).render('unavailabilities/create', {rooms, errorMessage: "La salle sélectionnée n'est pas disponible", oldInput: req.body});
            }
            const conflictReservation = await Reservation.findOne({
                where: {
                    room_id: value.room_id,
                    status: { [Op.in]: ['pending', 'confirmed'] },
                    start_at: { [Op.lt]: value.end_at },
                    end_at: { [Op.gt]: value.start_at } 
                }
            });

            if (conflictReservation) {
                const rooms = await Room.findAll({where:{active:true}, order:[['name','ASC']]});
                return res.status(StatusCodes.BAD_REQUEST).render('unavailabilities/create', {rooms, errorMessage: "Une réservation existe déjà pour cette période", oldInput: req.body});
            }

            const conflictUnavailability = await Unavailability.findOne({
                where: {
                    room_id: value.room_id,
                    start_at: { [Op.lt]: value.end_at },
                    end_at: { [Op.gt]: value.start_at } 
                }
            });

            if (conflictUnavailability) {
                const rooms = await Room.findAll({where:{active:true}, order:[['name','ASC']]});
                return res.status(StatusCodes.BAD_REQUEST).render('unavailabilities/create', {rooms, errorMessage: "Une indisponibilité existe déjà pour cette période", oldInput: req.body});
            }

            await Unavailability.create({
                ...value,
                manager_id: req.userId
            });

            return res.redirect('/manager/unavailabilities');

        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {message:"Impossible de créer cetteindisponibilité" });
        }
    }

    deleteUnavailability = async (req,res) => {
        try{
            const { id } = req.params;
            const unavailability = await Unavailability.findByPk(id);

            if(!unavailability){
                return res.status(StatusCodes.NOT_FOUND).render('error', {message: "Cette indisponibilité n'existe pas" });
            }

            await unavailability.destroy();
            return res.redirect('/manager/unavailabilities');

        } catch (error){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {message:'Impossible de supprimer cette indisponibilité' });
        }
    }

}

export default new UnavailabilityController();