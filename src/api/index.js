/* eslint-disable */
const express = require('express');
const {getData,getVideo} = require('../middlewaresapi/videos')
const { getDataImages } = require('../middlewaresapi/images');

const middlewares = require('../middlewares');


const router = express.Router();

router.get('/videos',getData,getVideo);
router.get('/images',getDataImages);

router.use(middlewares.notFound);
router.use(middlewares.errorHandler);

module.exports = router;
