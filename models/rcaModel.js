import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js"; // Assuming sequelize instance is configured here

class RCAForm extends Model {}

RCAForm.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    employeeCode: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // Ensures each employee code is unique
    },
    // Other fields can be added here as required for the RCA form (e.g., issues, root causes, etc.)
  },
  {
    sequelize,
    modelName: "RCAForm",
    tableName: "rca_forms", // Adjust table name as per your project structure
    timestamps: false,
  }
);

// Named export
export { RCAForm }; // Named export of RCAForm model