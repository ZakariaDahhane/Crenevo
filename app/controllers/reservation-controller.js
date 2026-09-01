import Joi from "joi";
import { Op } from 'sequelize';
import { Reservation, Room, Unavailability, User } from "../models/index.js";
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
 const rejectionSchema = Joi.object({
    rejection_reason: Joi.string()
      .trim()
      .min(3)
      .max(1000)
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

    createReservation = async (req,res) => {
        try{
            const {error, value} = reservationSchema.validate(
                req.body, {abortEarly: false}
            );
            if (error) {
                const rooms = await Room.findAll({where: {active: true}, order :[['name', 'ASC']]});
                return res.status(StatusCodes.BAD_REQUEST).render('reservations/create', {rooms, errorMessage: error.details[0].message, oldInput: req.body});
            }
            

            const room = await Room.findByPk(value.room_id);
            if(!room || !room.active) {
                const rooms = await Room.findAll({where:{active:true}, order:[['name','ASC']]});
                return res.status(StatusCodes.NOT_FOUND).render('reservations/create', {rooms, errorMessage:"La salle sélectionnée n'est pas disponible", oldInput: req.body});
            }

            if(value.participant_count > room.capacity){
                const rooms = await Room.findAll({where: {active: true}, order:[['name', 'ASC']]});
                return res.status(StatusCodes.BAD_REQUEST).render('reservations/create', {rooms, errorMessage:`Cette salle accepte au maximum ${room.capacity} personnes`, oldInput: req.body});
            }

            const conflictingReservation = await Reservation.findOne(
                {where: {room_id : value.room_id,
                     status:{[Op.in]:['pending', 'confirmed']},
                     start_at:{[Op.lt]:value.end_at},
                     end_at:{[Op.gt]:value.start_at}}
                }
            );

            if(conflictingReservation){
                const rooms = await Room.findAll({where: {active: true}, order:[['name', 'ASC']]});
                return res.status(StatusCodes.BAD_REQUEST).render('reservations/create', {rooms, errorMessage:"Cette salle est dèjà réservée pendant cet horaire", oldInput: req.body});
            }

            const conflictingUnavailability = await Unavailability.findOne(
                {where:{room_id : value.room_id,
                     start_at:{[Op.lt]:value.end_at},
                     end_at:{[Op.gt]:value.start_at}}
            })

            if(conflictingUnavailability){
                const rooms = await Room.findAll({where: {active: true}, order:[['name', 'ASC']]});
                return res.status(StatusCodes.BAD_REQUEST).render('reservations/create', {rooms, errorMessage:"Cette salle est indisponible pendant cet horaire", oldInput: req.body});
            }

            const status = room.approval_required ? 'pending' : 'confirmed';

            const reservation = await Reservation.create({
                ...value, user_id: req.userId, status
            });
            return res.redirect('/reservations');
        } catch (error){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {message: "Impossible de créer la réservation"});
        }   
    }

    getUserReservations = async (req, res) =>{
     try {
        const reservations = await Reservation.findAll(
        {where:{user_id:req.userId}, include: [{model: Room, as: 'room'}], order:[['start_at', 'ASC']],
        });
        return res.status(StatusCodes.OK).render('reservations/list', {reservations});
     }catch (error){
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error', {message: "Impossible de récupérer vos réservations"});
     }
    }

    getReservationById = async (req, res) => {
        try {
            const { id } = req.params ;
            const reservation = await Reservation.findByPk( id, 
                { include : [{ model: Room, as: 'room'}]
            });

            if (!reservation){
                return res.status(StatusCodes.NOT_FOUND).render('error', {message: "Cette réservation n'existe pas"});
            }

            const isOwner = reservation.user_id === req.userId;
            const isManager = req.userRole === 'manager';

            if(!isOwner && !isManager){
                return res.status(StatusCodes.FORBIDDEN).render('error', {message: 'vous ne pouvez pas consulter cette réservation'});
            }

            return res.status(StatusCodes.OK).render('reservations/detail', {reservation});
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error',{message: 'Impossible de récuperer cette réservation'});
        }
    }

    cancelReservation = async (req,res) =>{
        try {
            const { id } = req.params;
            const reservation = await Reservation.findByPk(id);

            if(!reservation){
                return res.status(StatusCodes.NOT_FOUND).render('error', {message: "Cette réservation n'existe pas"});   
            }
            if(reservation.user_id !== req.userId){
                return res.status(StatusCodes.FORBIDDEN).render('error', {message : "Vous ne pouvez pas annuler cette réservation"});
            }

            const cancellableStatuses = ['pending', 'confirmed'];

            if(!cancellableStatuses.includes(reservation.status)){
                return res.status(StatusCodes.CONFLICT).render('error', {message: "Vous ne pouvez pas annuler cette réservation"});
            }

            await reservation.update({status:'canceled', canceled_at: new Date()});
            return res.redirect(`/reservations/${reservation.id}`);
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error',{message: "Impossible d'annuler cette réseravtion" });
        }
    }

    getAllManager = async (req,res) =>{
        try {
            const reservations = await Reservation.findAll({
                include: [{model: Room, as: 'room'}, {model: User, as: 'user', attributes: ['id','first_name', 'last_name', 'email']}],
                order: [['start_at', 'ASC']]
            })
            return res.status(StatusCodes.OK).render('reservations/manage',{reservations});
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error',{message: "Impossible de récupérer les réservations" });
        }
    }

    confirmReservation = async (req, res) =>{
        try {
            const { id } = req.params;
            const reservation = await Reservation.findByPk(id);

            if(!reservation){
                return res.status(StatusCodes.NOT_FOUND).render('error', {message: "Cette réservation n'existe pas"});
            }

            if(reservation.status !== 'pending'){
                return res.status(StatusCodes.CONFLICT).render('error', {message:"Seule une réservation en attente peut etre confirmée"});
            }

            await reservation.update({
                status: 'confirmed',
                manager_id: req.userId,
                processed_at: new Date(),
                rejection_reason: null,
            });
            
            return res.redirect('/manager/reservations');
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error',{message: "Impossible de confirmer cette réservation" });
        }
    }

    rejectReservation = async (req, res) =>{
        try {
            const {error, value} = rejectionSchema.validate(req.body);
            
            if(error){
                return res.status(StatusCodes.BAD_REQUEST).render('error', {message: error.details[0].message})
            }
            const { id } = req.params;
            const reservation = await Reservation.findByPk(id);

            if(!reservation){
                return res.status(StatusCodes.NOT_FOUND).render('error', {message: "Cette réservation n'existe pas"});
            }
            if(reservation.status !== 'pending'){
                return res.status(StatusCodes.CONFLICT).render('error', {message:"Seule une réservation en attente peut etre refusée"});
            }
            await reservation.update({
                status: 'rejected',
                manager_id: req.userId,
                processed_at: new Date(),
                rejection_reason: value.rejection_reason,
            });
            
            return res.redirect('/manager/reservations');
        } catch (error) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).render('error',{message: "Impossible de refuser cette réservation" });
        }
    }
}

export default new ReservationController();