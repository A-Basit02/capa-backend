import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db.js"; // Adjust the path to your Sequelize instance
import sequencenumber from "./sequenceNumber.js"; // Adjust the path to your SequenceNumber model
import User from "./users.js"; // Adjust the path to your User model

class Post extends Model {}

Post.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User, // Reference to User model
        key: "id", // The key in the User model that this refers to
      },
    },
    capaNumber: {
      type: DataTypes.STRING,
      allowNull: true, // Temporarily allow null during creation
      unique: true, // Ensure uniqueness of CAPA number
    },
    eventSelection_rootCause: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    eventSelection_causeCategory: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDetails_customer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDetails_brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDetails_productType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDetails_towelType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDetails_article: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDetails_size: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDetails_color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDetails_design: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDetails_productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDetails_sos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productDetails_customerPO: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    problemDiscussion_dateOccurred: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    problemDiscussion_problemStatement: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    problemDiscussion_containmentAction: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    problemDiscussion_memberRCA: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    rcaFor6Ms_method: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    rcaFor6Ms_material: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    rcaFor6Ms_machine: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    rcaFor6Ms_manpower: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    rcaFor6Ms_measurement: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    rcaFor6Ms_milieu: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    correctiveAction_detection: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    correctiveAction_occurrence: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    correctiveAction_dateOccurred: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    preventiveAction_detection: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preventiveAction_occurrence: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    preventiveAction_dateOccurred: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "open", // Default value is "open"
      validate: {
        isIn: [["open", "closed"]], // Ensure status is either "open" or "closed"
      },
    },
    updatedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "PostModel",
    tableName: "posts",
    timestamps: true,
  }
);

// BeforeCreate Hook for Generating CAPA Number
Post.beforeCreate(async (post) => {
  try {
    // Fetch the current sequence value
    let sequence = await sequencenumber.findOne();

    if (!sequence) {
      // Initialize sequence if not present
      sequence = await sequencenumber.create({ sequenceValue: 1000 });
    }

    // Generate the next CAPA number
    const nextCapaNumber = sequence.sequenceValue + 1;

    // Set the generated CAPA number
    post.capaNumber = `#${nextCapaNumber}`;

    // Update the sequence value in the database
    sequence.sequenceValue = nextCapaNumber;
    await sequence.save();
  } catch (error) {
    console.error("Error generating CAPA number in beforeCreate:", error);
    throw new Error("Failed to generate CAPA number");
  }
});

// Define associations
User.hasMany(Post, { foreignKey: "userId", as: "posts" });
Post.belongsTo(User, { foreignKey: "userId", as: "user" });

Post.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Post, { foreignKey: "userId" });

export default Post;

// import { DataTypes, Model } from 'sequelize';
// import sequelize from '../config/db.js'; // Adjust the path to your Sequelize instance
// import sequencenumber from './sequenceNumber.js'; // Adjust the path to your SequenceNumber model
// import User from './users.js'; // Adjust the path to your User model

// class Post extends Model {}

// Post.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       autoIncrement: true,
//       primaryKey: true,
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       references: {
//         model: User, // Reference to User model
//         key: 'id',   // The key in the User model that this refers to
//       },
//     },
//     capaNumber: {
//       type: DataTypes.STRING,
//       allowNull: true, // Temporarily allow null during creation
//       unique: true,    // Ensure uniqueness of CAPA number
//     },
//     eventSelection_rootCause: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     eventSelection_causeCategory: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     productDetails_customer: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     productDetails_brand: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     productDetails_productType: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     productDetails_towelType: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     productDetails_article: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     productDetails_size: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     productDetails_color: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     productDetails_design: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     productDetails_productId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     productDetails_sos: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     productDetails_customerPO: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     problemDiscussion_dateOccurred: {
//       type: DataTypes.DATE,
//       allowNull: false,
//     },
//     problemDiscussion_problemStatement: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     problemDiscussion_containmentAction: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     problemDiscussion_memberRCA: {
//       type: DataTypes.JSON,
//       allowNull: false,
//     },
//     rcaFor6Ms_method: {
//       type: DataTypes.JSON,
//       allowNull: false,
//     },
//     rcaFor6Ms_material: {
//       type: DataTypes.JSON,
//       allowNull: false,
//     },
//     rcaFor6Ms_machine: {
//       type: DataTypes.JSON,
//       allowNull: false,
//     },
//     rcaFor6Ms_manpower: {
//       type: DataTypes.JSON,
//       allowNull: false,
//     },
//     rcaFor6Ms_measurement: {
//       type: DataTypes.JSON,
//       allowNull: false,
//     },
//     rcaFor6Ms_milieu: {
//       type: DataTypes.JSON,
//       allowNull: false,
//     },
//     correctiveAction_detection: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     correctiveAction_occurrence: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     correctiveAction_dateOccurred: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },
//     preventiveAction_detection: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     preventiveAction_occurrence: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     preventiveAction_dateOccurred: {
//       type: DataTypes.DATE,
//       allowNull: true,
//     },
//     status: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       defaultValue: 'open', // Use default value
//     },
//     updatedBy: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//   },
//   {
//     sequelize,
//     modelName: 'PostModel',
//     tableName: 'posts',
//     timestamps: true,
//   }
// );

// // BeforeCreate Hook for Generating CAPA Number
// Post.beforeCreate(async (post) => {
//   try {
//     // Fetch the current sequence value
//     let sequence = await sequencenumber.findOne();

//     if (!sequence) {
//       // Initialize sequence if not present
//       sequence = await sequencenumber.create({ sequenceValue: 1000 });
//     }

//     // Generate the next CAPA number
//     const nextCapaNumber = sequence.sequenceValue + 1;

//     // Set the generated CAPA number
//     post.capaNumber = `#${nextCapaNumber}`;

//     // Update the sequence value in the database
//     sequence.sequenceValue = nextCapaNumber;
//     await sequence.save();
//   } catch (error) {
//     console.error('Error generating CAPA number in beforeCreate:', error);
//     throw new Error('Failed to generate CAPA number');
//   }
// });

// // Define associations
// User.hasMany(Post, { foreignKey: 'userId', as: 'posts' });
// Post.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Post.belongsTo(User, { foreignKey: 'userId' });
// User.hasMany(Post, { foreignKey: 'userId' });

// export default Post;
