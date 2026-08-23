import sequelize from '../models/sequelize.client.js';
import {User, Room, Equipment, RoomEquipment, Unavailability, Incident} from '../models/index.js';
import * as argon2 from 'argon2';


try {
    await sequelize.sync();

    const seedPassword = process.env.SEED_PASSWORD;

    if (!seedPassword) {
        throw new Error('SEED_PASSWORD is missing in .env');
    }

    const passwordHash = await argon2.hash(seedPassword);
    
    // Seed Users
    const users = [
        { first_name: 'Michael', last_name: 'Jackson', email: 'michael@crenevo.test', password: passwordHash, role: 'manager' },
        { first_name: 'Sarah', last_name: 'Smith', email: 'sarah@crenevo.test', password: passwordHash, role: 'user' },
    ];
    await User.bulkCreate(users);

    // Seed Rooms
    const rooms = [
        { name: 'Kiev', building: 'A', floor:'1', capacity: 10, description: "salle lumineuse adaptée aux réunions d’équipe.", approval_required: false },
        { name: 'Stockholm', building: 'B', floor:'2', capacity: 20, description: 'petite salle équipée pour les visioconférences.', approval_required: true },
        { name: 'Paris', building: 'B', floor:'1', capacity: 15, description: 'grand espace adapté aux présentations et ateliers.', approval_required: false },
        { name: 'London', building: 'A', floor:'3', capacity: 25, description: 'salle calme pour les réunions en petit comité.', approval_required: false },
        { name: 'Madrid', building: 'C', floor:'1', capacity: 30, description: 'grande salle destinée aux conférences.', approval_required: true },
    ];
    await Room.bulkCreate(rooms);

    // Seed Equipment
    const equipment = [
        { name: 'Vidéoprojecteur' },
        { name: 'Écran de projection' },
        { name: 'Tableau blanc' },
        { name: 'Haut parleurs' },
        { name: 'Microphone' },
    ];
    await Equipment.bulkCreate(equipment);

    // Seed RoomEquipment
    const roomEquipment = [
        { room_id: 1, equipment_id: 1, equipment_id: 2, equipment_id: 3 },
        { room_id: 2, equipment_id: 1, equipment_id: 2, equipment_id: 3, equipment_id: 4, equipment_id: 5 },
        { room_id: 3, equipment_id: 1, equipment_id: 2, equipment_id: 3},
        { room_id: 4, equipment_id: 3, equipment_id: 5 },
        { room_id: 5, equipment_id: 1, equipment_id: 2, equipment_id: 3, equipment_id: 4, equipment_id: 5 },
    ];
    await RoomEquipment.bulkCreate(roomEquipment);

    console.log('Database seeded successfully.');
} catch (error) {
    console.error('Error seeding the database:', error);
}