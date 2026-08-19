import { DataTypes, Model } from 'sequelize';
import sequelize from './sequelize.client.js';

class User extends Model {}

User.init(
  {
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    role: {
      type: DataTypes.ENUM('user', 'manager'),
      allowNull: false,
      defaultValue: 'user',
    },
    
  },
  {
    sequelize,
    tableName: 'user',
    modelName: 'User',
    timestamps: true,
  },
);

export default User;