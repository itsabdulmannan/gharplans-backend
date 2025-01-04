const utmLink = require('../models/utm.Model');

const trackTraffic = async (req, res, next) => {
    try {
        const { medium, campaign } = req.query;
        console.log('Medium:', medium, 'Campaign:', campaign);

        let updatedUtmLink = null;
        let trafficError = false;

        if (medium && campaign) {
            const utmLinkRecord = await utmLink.findOne({
                where: {
                    medium: medium,
                    campaign: campaign
                }
            });

            if (utmLinkRecord) {
                updatedUtmLink = await utmLinkRecord.update({
                    traffic: utmLinkRecord.traffic + 1
                });
                console.log(`Traffic incremented for medium: ${medium} and campaign: ${campaign}`);
            } else {
                console.log(`No matching UTM link found for medium: ${medium} and campaign: ${campaign}`);
            }
        } else {
            console.log('Missing medium or campaign parameters.');
        }

        req.updatedUtmLink = updatedUtmLink;
        req.trafficError = trafficError; 

        next();
    } catch (error) {
        console.error('Error tracking traffic:', error);
        req.trafficError = true; 
        next();
    }
};

module.exports = trackTraffic;
