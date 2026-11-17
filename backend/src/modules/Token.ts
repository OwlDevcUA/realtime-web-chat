import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "src/utils/db";

export interface Token extends Model<InferAttributes<Token>, InferCreationAttributes<Token>> {
  refreshToken: string;
  userId: string;
} 

export const Token = sequelize.define<Token>('token', {
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  }
}, { tableName: 'tokens' });

