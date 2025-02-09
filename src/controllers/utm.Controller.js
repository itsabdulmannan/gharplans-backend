const utm = require('../models/utm.Model');

const utmController = {
    createUtm: async (req, res) => {
        try {
            const {
                baseUrl,     // The base URL of your website or landing page where traffic is directed.
                source,      // The specific source of the traffic (e.g., 'facebook', 'instagram', 'google').
                medium,      // The marketing medium or channel (e.g., 'social', 'email', 'influencer', 'cpc').
                campaign,    // The name of the specific campaign driving traffic (e.g., 'new_launch', 'holiday_sale_johnDoe').
                couponCode   //A unique coupon or promotional code associated with the campaign.
            } = req.body;
            // const utmUrl = `${baseUrl}?utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
            const utmUrl = `${baseUrl}?utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`;

            const newUtm = await utm.create({ baseUrl, source, medium, campaign, utmUrl, couponCode })
            res.status(201).json({ status: true, message: "Link Generated Successfully", data: newUtm });
        } catch (error) {
            console.error("Error while generating the link");
            res.status(500).json({ status: false, message: "Internal Server Error", error: error.message });
        }
    },
    getUtm: async (req, res) => {
        try {
            const { medium, campaign } = req.query;
            const whereCondition = {};

            if (medium) whereCondition.medium = medium;
            if (campaign) whereCondition.campaign = campaign;

            const utmLinks = await utm.findAll({
                where: whereCondition,
            });

            if (req.trafficError) {
                return res.status(500).json({ status: false, message: "Error tracking traffic, no data available" });
            }

            if (utmLinks.length === 0) {
                return res.status(404).json({ status: false, message: "No UTM links found" });
            }

            const responseData = {
                status: true,
                message: "Success",
                data: utmLinks
            };

            if (req.updatedUtmLink) {
                responseData.message = "Traffic incremented successfully";
                responseData.data = req.updatedUtmLink;
            }

            res.status(200).json(responseData);
        } catch (error) {
            console.error("Error while getting the link:", error);
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    },
    getAllUtm: async (req, res) => {
        try {
            const utmLinks = await utm.findAll();
            if (utmLinks.length === 0) {
                return res.status(404).json({ status: false, message: "No UTM links found" });
            }
            res.status(200).json({ status: true, message: "Success", data: utmLinks });
        } catch (error) {
            console.error("Error while getting the link:", error);
            res.status(500).json({ status: false, message: "Internal Server Error" });
        }
    },
    patchUtmStatus: async (req, res) => {
        try {
            const { id, status } = req.query;
            const utmLink = await utm.findByPk(id);
            if (!utmLink) {
                return res.status(404).json({ status: false, message: "No UTM link found" });
            }
            utmLink.status = status;
            await utmLink.save();
            res.status(200).json({ status: true, message: "Status updated successfully", data: utmLink });
        } catch (error) {
            console.error("Error while updating the status:", error);
            res.status(500).json({ status: false, message: "Internal Server Error" });

        }
    }
}

module.exports = utmController;