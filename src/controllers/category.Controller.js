const Category = require('../models/category.Model');
const Products = require('../models/product.Model');
const { Op } = require('sequelize');

const categoryController = {
    addCategory: async (req, res) => {
        try {
            const { name, description, status } = req.body;
            const imageUrl = `/images/${req.file.filename}`
            const category = await Category.create({ name, description, image: imageUrl, status });
            res.status(201).json({ status: true, message: "Category added successfully.", category });
        } catch (error) {
            console.error('Error adding category:', error);
            res.status(500).json({ status: false, error: "Internal Server Error" });
        }
    },
    getCategoryByIdAndName: async (req, res) => {
        try {
            const { id, categoryName, productName, offset = 0, limit = 10 } = req.query;

            if (id) {
                const data = await Category.findByPk(id, {
                    include: [
                        {
                            model: Products,
                            attributes: ['id', 'name', 'price', 'description', 'image'],
                        },
                    ],
                });

                if (!data) {
                    return res.status(404).json({ status: false, error: "Category not found" });
                }

                const category = data.dataValues;
                category.image = `${process.env.BASE_URL}/${category.image.replace(/^\/|\/$/g, '')}`;
                if (category.Products) {
                    category.Products = category.Products.map((product) => {
                        product.image = `${process.env.BASE_URL}/${product.image.replace(/^\/|\/$/g, '')}`;
                        return product;
                    });
                }

                return res.status(200).json({ status: true, category });
            } else if (categoryName || productName) {
                const whereConditions = {};
                if (categoryName) {
                    whereConditions.name = {
                        [Op.like]: `%${categoryName}%`,
                    };
                }

                const categories = await Category.findAll({
                    where: whereConditions,
                    include: [
                        {
                            model: Products,
                            attributes: ['id', 'name', 'price', 'description', 'image'],
                            where: productName
                                ? {
                                    name: {
                                        [Op.like]: `%${productName}%`,
                                    },
                                }
                                : undefined,
                        },
                    ],
                    offset: parseInt(offset),
                    limit: parseInt(limit),
                });

                const totalCategories = await Category.count({
                    where: whereConditions,
                    include: [
                        {
                            model: Products,
                            where: productName
                                ? {
                                    name: {
                                        [Op.like]: `%${productName}%`,
                                    },
                                }
                                : undefined,
                        },
                    ],
                });

                const totalPages = Math.ceil(totalCategories / limit);

                if (categories.length === 0) {
                    return res.status(404).json({ status: false, error: "No categories found" });
                }

                const categoriesData = categories.map((category) => {
                    const categoryData = category.dataValues;
                    categoryData.image = `${process.env.BASE_URL}/${categoryData.image.replace(/^\/|\/$/g, '')}`;
                    if (categoryData.Products) {
                        categoryData.Products = categoryData.Products.map((product) => {
                            product.image = `${process.env.BASE_URL}/${product.image.replace(/^\/|\/$/g, '')}`;
                            return product;
                        });
                    }

                    return categoryData;
                });

                return res.status(200).json({
                    status: true,
                    categories: categoriesData,
                    pagination: {
                        totalRecords: totalCategories,
                        totalPages: totalPages,
                        currentPage: Math.ceil((offset / limit) + 1),
                        perPage: limit,
                    },
                });
            } else {
                const categories = await Category.findAll({
                    include: [
                        {
                            model: Products,
                            attributes: ['id', 'name', 'price', 'description', 'image'],
                        },
                    ],
                    offset: parseInt(offset),
                    limit: parseInt(limit),
                });

                const totalCategories = await Category.count();
                const totalPages = Math.ceil(totalCategories / limit);

                const categoriesData = categories.map((category) => {
                    const categoryData = category.dataValues;
                    categoryData.image = `${process.env.BASE_URL}/${categoryData.image.replace(/^\/|\/$/g, '')}`;

                    if (categoryData.Products) {
                        categoryData.Products = categoryData.Products.map((product) => {
                            product.image = `${process.env.BASE_URL}/${product.image.replace(/^\/|\/$/g, '')}`;
                            return product;
                        });
                    }

                    return categoryData;
                });

                return res.status(200).json({
                    status: true,
                    categories: categoriesData,
                    pagination: {
                        totalRecords: totalCategories,
                        totalPages: totalPages,
                        currentPage: Math.ceil((offset / limit) + 1),
                        perPage: limit,
                    },
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: false, error: "Internal Server Error" });
        }
    },
    updateCategory: async (req, res) => {
        try {
            const id = req.params.id;
            const { name, description, image, status } = req.body;
            const category = await Category.findByPk(id);
            if (!category) {
                res.status(404).json({ status: false, error: "Category not found" });
            }
            await Category.update({ name, description, image, status }, { where: { id } });
            res.status(200).json({ status: true, message: "Category updated successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, error: "Internal Server Error" });
        }
    },
    deleteCategory: async (req, res) => {
        try {
            const id = req.params.id;
            const category = await Category.findByPk(id);
            if (!category) {
                res.status(404).json({ status: false, error: "Category not found" });
            }
            await Category.destroy({ where: { id } });
            res.status(200).json({ status: true, message: "Category deleted successfully." });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: false, error: "Internal Server Error" });
        }
    },
    patchCaregoryStatus: async (req, res) => {
        try {
            const { id, status } = req.body
            const category = await Category.findByPk(id);
            if (!category) {
                return res.status(404).json({ status: false, error: "Category not found" });
            }
            await Category.update({ status }, { where: { id } });
            return res.status(200).json({ status: true, message: "Category status updated successfully." });
        } catch (error) {

        }
    }
}

module.exports = categoryController;