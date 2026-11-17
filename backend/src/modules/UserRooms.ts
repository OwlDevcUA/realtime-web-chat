import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../utils/db.js';

export interface UserRooms extends Model<InferAttributes<UserRooms>, InferCreationAttributes<UserRooms>> {
  id: CreationOptional<string>;
  roomId: string;
  userId: string;
} 

export const UserRooms = sequelize.define<UserRooms>(
  'user__room',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => crypto.randomUUID(),
      primaryKey: true,
    },
    roomId: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  { tableName: 'user__rooms' },
);

