const productsdeliverycharges = require('../models/productDeliveryCharges.Model');
const product = require('../models/product.Model');
const Cities = require('../models/cities.Model');

const productDeliveryChargesController = {

    addProductDeliveryCharges: async (req, res) => {
        try {
            const { productId, sourceCityId, destinationCityId, price } = req.body;
            console.log("Destrucutred Data", "Prodcut Id", productId, "Source City Id", sourceCityId, "Destination City Id", destinationCityId, "Price", price);
            console.log("Request Body:", req.body);
            const checkProduct = await product.findByPk(productId);
            if (!checkProduct) {
                return res.status(404).json({ message: `Product with id ${productId} not found.` });
            }
            console.log(sourceCityId, destinationCityId);
            const productDeliveryCharges = await productsdeliverycharges.create({ productId, sourceCityId, destinationCityId, deliveryCharge: price });
            res.status(201).json(productDeliveryCharges);
        } catch (error) {
            console.error("Error adding product delivery charges:", error);
            res.status(400).json({ message: "Error adding product delivery charges", error: error.message });
        }
    },
    getProductDeliveryCharges: async (req, res) => {
        try {
            const { id } = req.query;
            let deliveryCharges;

            if (id) {
                deliveryCharges = await productsdeliverycharges.findByPk(id, {
                    include: [
                        { model: product, as: 'product', attributes: ['id', 'name', 'price'] },
                        { model: Cities, as: 'sourceCity', attributes: ['name'] },
                        { model: Cities, as: 'destinationCity', attributes: ['name'] },
                    ],
                });

                if (!deliveryCharges) {
                    return res.status(404).json({ message: `Delivery charge with id ${id} not found.` });
                }
            } else {
                deliveryCharges = await productsdeliverycharges.findAll({
                    include: [
                        { model: product, as: 'product', attributes: ['id', 'name', 'price'] },
                        { model: Cities, as: 'sourceCity', attributes: ['name'] },
                        { model: Cities, as: 'destinationCity', attributes: ['name'] },
                    ],
                });
            }

            const response = Array.isArray(deliveryCharges)
                ? deliveryCharges.map((charge) => ({
                    id: charge.id,
                    deliveryCharge: charge.deliveryCharge,
                    // createdAt: charge.createdAt,
                    // updatedAt: charge.updatedAt,
                    product: charge.product,
                    sourceCity: charge.sourceCity.name,
                    destinationCity: charge.destinationCity.name,
                }))
                : {
                    id: deliveryCharges.id,
                    deliveryCharge: deliveryCharges.deliveryCharge,
                    createdAt: deliveryCharges.createdAt,
                    updatedAt: deliveryCharges.updatedAt,
                    product: deliveryCharges.product,
                    sourceCity: deliveryCharges.sourceCity.name,
                    destinationCity: deliveryCharges.destinationCity.name,
                };

            res.status(200).json({
                status: true,
                data: response,
            });
        } catch (error) {
            console.error("Error fetching delivery charges with associations:", error);
            res.status(500).json({ message: "Error fetching delivery charges", error: error.message });
        }
    },
    updateProductDeliveryCharges: async (req, res) => {
        try {
            const { id } = req.params;
            const { price, productId, sourceCityId, destinationCityId } = req.body;

            console.log("Request Body:", req.body);
            if (!price || !productId || !sourceCityId || !destinationCityId) {
                return res.status(400).json({ message: "Missing required fields: charge, productId, sourceCityId, and destinationCityId are required." });
            }
            const productDeliveryCharge = await productsdeliverycharges.findByPk(id);
            if (!productDeliveryCharge) {
                return res.status(404).json({ message: `Product delivery charge with id ${id} not found.` });
            }

            productDeliveryCharge.deliveryCharge = price;
            productDeliveryCharge.productId = productId;
            productDeliveryCharge.sourceCityId = sourceCityId;
            productDeliveryCharge.destinationCityId = destinationCityId;

            await productDeliveryCharge.save();

            res.status(200).json({ message: "Product delivery charge updated successfully" });
        } catch (error) {
            console.error("Error updating product delivery charge:", error);
        }
    },

    deleteProductDeliveryCharges: async (req, res) => {
        try {
            const { id } = req.params;
            const checkProductDeliveryCharges = await productsdeliverycharges.findByPk(id);
            if (!checkProductDeliveryCharges) {
                return res.status(404).json({ message: `Product delivery charges with id ${id} not found.` });
            }
            const deleted = await productsdeliverycharges.destroy({
                where: { id }
            });

            if (deleted) {
                res.status(200).json({ message: `Product delivery charges with id ${id} has been deleted.` });
            } else {
                res.status(404).json({ message: `Product delivery charges with id ${id} not found.` });
            }
        } catch (error) {
            console.error("Error deleting product delivery charges:", error);
            res.status(400).json({ message: "Error deleting product delivery charges", error: error.message });
        }
    }
};

module.exports = productDeliveryChargesController;
