const express = require('express');
const router = express.Router();
const { getMeals, addMeal, updateMeal, deleteMeal } = require('../controllers/cookbookCtrl');

router.get('/', getMeals);
router.post('/add', addMeal);
router.put('/update/:id', updateMeal);
router.delete('/delete/:id', deleteMeal);
router.get('/', (req, res) => {
    res.render('cookbook', { user: req.session.user });
});
module.exports = router;
