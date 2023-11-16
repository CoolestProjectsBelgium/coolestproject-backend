import { Model, DataTypes, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';

export class Account extends Model {
  declare password: string;

  verifyPassword(password: string): boolean {
    return bcrypt.compareSync(password, this.password);
  }
}

export const init = (sequelize: Sequelize) => {
  Account.init({
    email: {
      type: DataTypes.STRING(100),
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      get() {
        return this.getDataValue('password');
      },
      set(password: string) {
        const salt = bcrypt.genSaltSync(10); // Specify the salt rounds
        const hashedPassword = bcrypt.hashSync(password, salt);
        this.setDataValue('password', hashedPassword);
      },
    },
    account_type: DataTypes.ENUM('super_admin', 'admin', 'jury'),
  }, {
    sequelize,
    modelName: 'Account',
  });
}