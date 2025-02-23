const Banners = require('../models/banners.Model');

const bannerController = {
    addBanner: async (req, res) => {
        try {
            const { title, description, link, status } = req.body;
            const imageUrl = `/images/${req.file.filename}`;
            const banner = await Banners.create({ title, description, link, image: imageUrl, status });

            res.status(201).json({ status: true, message: "Banner added successfully.", banner });
        } catch (error) {
            console.error('Error adding banner:', error);
            res.status(500).json({ status: false, error: "Internal Server Error" });
        }
    },
    getBanners: async (req, res) => {
        try {
            const banners = await Banners.findAll();
            res.status(200).json(banners);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getBannerById: async (req, res) => {
        try {
            const banner = await Banners.findByPk(req.params.id);
            if (!banner) {
                return res.status(404).json({ message: "Banner not found" });
            }
            res.status(200).json(banner);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateBanner: async (req, res) => {
        try {
            const banner = await Banners.findByPk(req.params.id);
            if (!banner) {
                return res.status(404).json({ message: "Banner not found" });
            }

            const { title, description, link, status } = req.body;

            let imageUrl = banner.image;
            if (req.file) {
                imageUrl = `/images/${req.file.filename}`;
            }

            await banner.update({ title, description, link, status, image: imageUrl });

            res.status(200).json({ status: true, message: "Banner updated successfully.", banner });
        } catch (error) {
            console.error('Error updating banner:', error);
            res.status(500).json({ status: false, error: "Internal Server Error" });
        }
    },

    deleteBanner: async (req, res) => {
        try {
            const banner = await Banners.findByPk(req.params.id);
            if (!banner) {
                return res.status(404).json({ message: "Banner not found" });
            }
            await banner.destroy();
            res.status(200).json({ message: "Banner deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = bannerController;
