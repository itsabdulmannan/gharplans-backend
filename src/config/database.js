const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    logging: false,
    timezone: '+00:00',  // UTC
});

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to the database:', error);
    });

sequelize.sync({ force: false }).then(() => {
    console.log('Database & tables created!');
}).catch((error) => {
    console.error('Unable to create database & tables:', error);
})

module.exports = sequelize;