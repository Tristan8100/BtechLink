require('dotenv').config();
const { Sequelize, DataTypes } = require('sequelize');
//console.log('sfhretj');
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
    timezone: "+08:00",
  }
);

const user = require('./usermodel')(sequelize, DataTypes);

// Sync models with the database
sequelize.sync()   //{alter: true} use this to sync changes
  .then(() => console.log('✅ Database synced'))
  .catch((err) => console.error('❌ Sync error:', err));

module.exports = { sequelize, user };