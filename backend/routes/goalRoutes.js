const express = require('express')
const { protect } = require('../middleware/authMiddleware')
const { getGoals, setGoal, updateGoal, deleteGoal } = require('../controllers/goalController')
const router = express.Router()

router.route("/").get(protect,getGoals).post(protect,setGoal)
router.route("/:id").delete(protect,deleteGoal).put(protect,updateGoal)

module.exports = router