const cities = require('../models/cities.Model');
const { Sequelize } = require('sequelize');

const citiesController = {
    getCities: async (req, res) => {
        try {
            const { offset = 0, limit = 10 } = req.query;
            const citiesList = await cities.findAll(
                {
                    offset: parseInt(offset) || 0,
                    limit: parseInt(limit) || 10
                }
            );
            res.status(200).json(citiesList);
        } catch (error) {
            console.error("Error getting cities:", error);
            res.status(500).json({ message: error.message });
        }
    },
    addCity: async (req, res) => {
        try {
            const { name } = req.body;
            const newCity = await cities.create({ name });
            res.status(201).json({ status: true, message: "City deleted successfully.", newCity });
        } catch (error) {
            console.error("Error adding city:", error);

            if (error instanceof Sequelize.UniqueConstraintError) {
                return res.status(400).json({ message: "City name already exists." });
            }

            res.status(500).json({ message: error.message });
        }
    },
    updateCity: async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            console.log('Id', id, 'Name', name);
            const updatedCity = await cities.update({ name }, { where: { id } });
            res.status(200).json({ status: true, message: "City updated successfully.", updatedCity });
        } catch (error) {
            console.error("Error updating city:", error);
            res.status(500).json({ message: error.message });
        }
    },
    deleteCity: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedCity = await cities.destroy({ where: { id } });
            res.status(200).json({ status: true, message: "City deleted successfully.", deletedCity });
        } catch (error) {
            console.error("Error deleting city:", error);
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = citiesController;