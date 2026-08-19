import { DataTypes, Model} from 'sequelize';
import sequelize from './sequelize.client.js';

class Equipment extends Model {}

Equipment.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'equipment',
    modelName: 'Equipment',
    timestamps: true,
  },
);

export default Equipment;