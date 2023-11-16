import { Model, DataTypes, Sequelize } from 'sequelize';
//import { sequelize } from './index.js'

interface TableAttributes {
  name: string;
  maxPlaces: number;
  requirements: Record<string, any>; // Adjust the data type as needed for your requirements
}


export class Table extends Model<TableAttributes> {
  public name!: string;
  public maxPlaces!: number;
  public requirements!: Record<string, any>;
}

export const init = (sequelize: Sequelize) => {
  Table.init(
    {
      name: {
        type: DataTypes.STRING(15),
        unique: true,
      },
      maxPlaces: DataTypes.INTEGER,
      requirements: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: 'Table',
    }
  );
}