import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { sequelize } from '../utils/db.js';

export interface Message extends Model<InferAttributes<Message>, InferCreationAttributes<Message>> {
  time: string;
  id: CreationOptional<string>;
  text: string;
  roomId: string;
  userId: string;
} 

export const Message = sequelize.define<Message>(
  'Message',
  {
    time: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id: {
      type: DataTypes.UUID,
      defaultValue: () => crypto.randomUUID(),
      primaryKey: true,
      allowNull: false,
    },
    text: {
      type: DataTypes.STRING,
      allowNull: false,
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
  { tableName: 'messages' },
);
