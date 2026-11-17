import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../utils/db.js';

export interface Room extends Model<InferAttributes<Room>, InferCreationAttributes<Room>> {
  name: string;
  id: CreationOptional<string>;
} 


export const Room = sequelize.define<Room>(
  'Room',
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.UUID,
      defaultValue: () => crypto.randomUUID(),
      primaryKey: true,
      allowNull: false,
    },
  },
  { tableName: 'rooms' },
);

