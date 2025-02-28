module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      user_ID: {
        type: DataTypes.STRING(50),
        primaryKey: true,
        },
      user_firstname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_lastname: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      user_password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      user_code: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      user_status: {
        type: DataTypes.ENUM('ACTIVE', 'INACTIVE'),
        allowNull: false,
        defaultValue: 'INACTIVE',
      },
      user_loggedstrat: {
        type: DataTypes.ENUM('GOOGLE', 'LOCALSTRAT'),
        allowNull: false,
        defaultValue: 'LOCALSTRAT',
      },
    });
  
    User.associate = (models) => {
      // Example: User has many 
      // User.hasMany(models.Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
    };
  
    return User;
  };
  