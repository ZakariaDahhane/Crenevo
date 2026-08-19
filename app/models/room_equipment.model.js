import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.client.js';

class RoomEquipment extends Model {}

RoomEquipment.init(
  {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'room',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    equipment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'equipment',
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'room_equipment',
    modelName: 'RoomEquipment',
    timestamps: true,
  },
);

export default RoomEquipment;