import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/db.js'; // Adjust the path to your Sequelize instance

class SequenceNumber extends Model {}

SequenceNumber.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sequenceValue: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1000, // Start CAPA numbers from #1001
    },
  },
  {
    sequelize,
    modelName: 'SequenceNumber',
    tableName: 'SequenceNumbers',
    timestamps: false,
  }
);

export default SequenceNumber;