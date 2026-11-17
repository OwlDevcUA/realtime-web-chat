import { Message } from "./Message";
import { Room } from "./Room";
import { Token } from "./Token";
import { User } from "./User";
import { UserRooms } from "./UserRooms";

Message.belongsTo(Room, { foreignKey: 'roomId' });
Message.belongsTo(User, { foreignKey: 'userId' });

Message.addScope('defaultScope', {
  include: [
    {
      model: User,
      attributes: ['username', 'id'],
    },
  ],
}, { override: true });

Room.belongsToMany(User, { through: UserRooms, foreignKey: 'roomId' });
Room.hasMany(Message, {
  foreignKey: 'roomId',
  onDelete: 'CASCADE',
  as: 'messages',
});

User.belongsToMany(Room, { through: UserRooms, foreignKey: 'userId' });
User.hasOne(Token, { foreignKey: 'userId' });
User.hasMany(Message, { foreignKey: 'userId', as: 'messages' });

Token.belongsTo(User, { foreignKey: 'userId' });

UserRooms.belongsTo(User, { foreignKey: 'userId' });
UserRooms.belongsTo(Room, { foreignKey: 'roomId' });