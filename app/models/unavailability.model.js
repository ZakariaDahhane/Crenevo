import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.client.js';

class Unavailability extends Model {} 

Unavailability.init(
  {
    start_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    room_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'room',
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
    manager_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
  },
  {
    sequelize,
    tableName: 'unavailability',
    modelName: 'Unavailability',
    timestamps: true,
  },
);

export default Unavailability;