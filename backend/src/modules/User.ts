import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../utils/db.js';

export interface User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  id: CreationOptional<string>;
  username: string;
  email: string;
  password: string;
  activationToken: string | null;
  resetPasswordToken: string | null;
} 

export const User = sequelize.define<User>('User',
  {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
    username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  activationToken: {
    type: DataTypes.STRING,
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
  },
}, { tableName: 'users' })

