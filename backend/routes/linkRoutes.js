const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getLink, setLink, updateLink, deleteLink} = require('../controllers/linkController');
const router = express.Router();

router.route("/:hash").get(getLink);
router.route("/").post(protect,setLink);
router.route("/:hash").delete(protect,deleteLink).put(protect,updateLink);

module.exports = router;