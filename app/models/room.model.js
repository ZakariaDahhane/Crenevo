import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.client.js';

class Room extends Model {}

Room.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    building: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    floor: {
      type: DataTypes.STRING,
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    image: {
      type: DataTypes.STRING,
    },
    approval_required: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'room',
    modelName: 'Room',
    timestamps: true,
  },
);

export default Room;