import User from './user.model.js';
import Room from './room.model.js';
import Equipment from './equipment.model.js';
import RoomEquipment from './room_equipment.model.js';
import Reservation from './reservation.model.js';
import Unavailability from './unavailability.model.js';
import Incident from './incident.model.js';

// USER - RESERVATION 

//       USER

User.hasMany(Reservation,{
    as: 'reservations',
    foreignKey: 'user_id',
    onDelete: 'RESTRICT',
});
Reservation.belongsTo(User,{
    as: 'user',
    foreignKey: 'user_id',
    onDelete:'RESTRICT',
});

//       Manager

User.hasMany(Reservation,{
    as: 'managed_reservations',
    foreignKey: 'manager_id',
    onDelete: 'RESTRICT',

});
Reservation.belongsTo(User,{
    as: 'manager',
    foreignKey: 'manager_id',
    onDelete:'RESTRICT',
});

// USER - UNAVAILABILITY

User.hasMany(Unavailability,{
    as: 'created_unavailabilities',
    foreignKey: 'manager_id',
    onDelete: 'RESTRICT',
});
Unavailability.belongsTo(User,{
    as: 'manager',
    foreignKey: 'manager_id',
    onDelete:'RESTRICT',
});

// ROOM - RESERVATION

Room.hasMany(Reservation,{
    as: 'reservations',
    foreignKey: 'room_id',
    onDelete: 'RESTRICT',
});
Reservation.belongsTo(Room,{
    as: 'room',
    foreignKey: 'room_id',
    onDelete: 'RESTRICT',
});

// ROOM - ROOMEQUIPMENT

Room.hasMany(RoomEquipment, {
  as: 'room_equipments',
  foreignKey: 'room_id',
  onDelete: 'CASCADE',
});

RoomEquipment.belongsTo(Room, {
  as: 'room',
  foreignKey: 'room_id',
  onDelete: 'CASCADE',
});

// EQUIPMENT - ROOM_EQUIPMENT

Equipment.hasMany(RoomEquipment, {
  as: 'room_equipments',
  foreignKey: 'equipment_id',
  onDelete: 'CASCADE',
});

RoomEquipment.belongsTo(Equipment, {
  as: 'equipment',
  foreignKey: 'equipment_id',
  onDelete: 'CASCADE',
});

// ROOM - EQUIPMENT

Room.belongsToMany(Equipment,{
    through: RoomEquipment,
    foreignKey: 'room_id',
    otherKey: 'equipment_id',
});
Equipment.belongsToMany(Room,{
    through: RoomEquipment,
    foreignKey: 'equipment_id',
    otherKey: 'room_id',
});

// USER - INCIDENT

// USER

User.hasMany(Incident,{
    as: 'reported_incidents',
    foreignKey: 'reported_by_id',
    onDelete: 'RESTRICT',
});
Incident.belongsTo(User,{
    as: 'reporter',
    foreignKey: 'reported_by_id',
    onDelete: 'RESTRICT',
});

// MANAGER

User.hasMany(Incident,{
    as: 'managed_incidents',
    foreignKey: 'manager_id',
    onDelete: 'RESTRICT',
});
Incident.belongsTo(User,{
    as: 'manager',
    foreignKey: 'manager_id',
    onDelete: 'RESTRICT',
});

// ROOM - INCIDENT

Room.hasMany(Incident,{
    as: 'incidents',
    foreignKey: 'room_id',
    onDelete: 'RESTRICT',
});
Incident.belongsTo(Room,{
    as:'room',
    foreignKey: 'room_id',
    onDelete:'RESTRICT',
});

// ROOM - UNAVAILABILITY

Room.hasMany(Unavailability,{
    as: 'unavailabilities',
    foreignKey: 'room_id',
    onDelete: 'RESTRICT',
});
Unavailability.belongsTo(Room,{
    as: 'room',
    foreignKey:'room_id',
    onDelete: 'RESTRICT',
});

export{
    User,
    Room,
    Equipment,
    RoomEquipment,
    Reservation,
    Unavailability,
    Incident,
};