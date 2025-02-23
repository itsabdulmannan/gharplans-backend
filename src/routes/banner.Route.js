const bannerRouter = require('express').Router();
const bannerController = require('../controllers/banner.Controller');
const upload = require('../middleware/multer');
const { authenticate, authorize } = require('../middleware/auth');

bannerRouter.post('/add', authenticate, authorize('admin'), upload.single('image'), bannerController.addBanner);
bannerRouter.get('/get', bannerController.getBanners);
bannerRouter.get('/getbyid/:id', bannerController.getBannerById);
bannerRouter.put('/update/:id', authenticate, authorize('admin'), upload.single('image'), bannerController.updateBanner);
bannerRouter.delete('/delete/:id', authenticate, authorize('admin'), bannerController.deleteBanner);

module.exports = bannerRouter;