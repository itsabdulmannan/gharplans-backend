'use strict';

const bcrypt = require('bcrypt');
require('dotenv').config();

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    try {
      const userExists = await queryInterface.rawSelect(
        'users',
        { where: { email } },
        ['id']
      );

      if (userExists) {
        console.log('Admin user already exists.');
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      await queryInterface.bulkInsert('users', [
        {
          name,
          email,
          password: hash,
          role: 'admin',
          isVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      console.log('Admin user created successfully.');
    } catch (error) {
      console.error('Error while creating admin user:', error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const email = process.env.ADMIN_EMAIL || 'admin@example.com';
    await queryInterface.bulkDelete('Users', { email });
  },
};