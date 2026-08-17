import { DataTypes, Model} from 'sequelize';
import sequelize from './sequelize.client.js';

class Reservation extends Model {}

Reservation.init(
  {
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    start_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    participant_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
    rejection_reason: {
      type: DataTypes.TEXT,
    },
    processed_at: {
      type: DataTypes.DATE,
    },
    canceled_at: {
      type: DataTypes.DATE,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'RESTRICT',
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
      allowNull: true,
      references: {
        model: 'user',
        key: 'id',
      },
      onDelete: 'RESTRICT',
    },
  },
  {
    sequelize,
    tableName: 'reservation',
    modelName: 'Reservation',
    timestamps: true,
  },
);

export default Reservation;