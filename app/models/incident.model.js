import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.client.js';

class Incident extends Model {}

Incident.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'open',
    },
    reported_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    resolved_at: {
      type: DataTypes.DATE,
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
    reported_by_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user',
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
    tableName: 'incident',
    modelName: 'Incident',
    timestamps: true,
  },
);

export default Incident;