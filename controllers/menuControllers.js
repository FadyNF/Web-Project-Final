const mongoose = require('mongoose');
const Recipe = require('../Schema/mealSchema');
const User = require('../Schema/userSchema');
const userCtrl=require('../controllers/userCtrl');

//show all menu items
// const getMenu = async (req, res) => {
//     try {
//         const menuData = await Recipe.find();
//         res.render('menu', { menuData });
//     } catch (err) {
//         console.error('Error fetching recipes:', err);
//         res.status(500).json({ error: 'Failed to fetch recipes' });
//     }
// };


// Show all menu items according to user preferences
const getMenu = async (req, res) => {
    try {

        if (!req.session.user) {
            req.session.user = await User.findById(req.session.userId);
        }
        const user = req.session.user;
        
        if (user.subscriptionStatus === "Deactivated") {
            res.render('our-plans');
            return;
        }

        const preferences = user.subPlan.preferences;
        console.log('User preferences:', preferences);

        const menuData = await Recipe.find({ preferences: { $in: preferences } });

        res.render('menu', { menuData });
    } catch (err) {
        console.error('Error fetching recipes:', err);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
};


//add new recipe
const addRecipe = async (req, res) => {
    try {
        const { name, image, cookTime, difficulty, tags, prefrences, description, ingredientsName, ingPer2, ingPer4, instructions, allergens, utensils, nutrition, recommendations } = req.body;
        const newRecipe = new Recipe({
            name,
            image,
            cookTime,
            difficulty,
            tags,
            prefrences,

            description,
            ingredientsName,
            ingPer2,
            ingPer4,
            instructions,
            allergens,
            utensils,
            nutrition,
            recommendations
        });

        await newRecipe.save();
        res.status(201).send('Recipe Added');
    } catch (err) {
        console.log(err);
        res.status(500).send(' Failed to Add');
    }
};

const deleteRecipe = async (req, res) => {
    const { id } = req.params;
    console.log(`Received ID: ${id}`);
    try {
        const deletedRecipe = await Recipe.findByIdAndDelete(id);
        if (!deletedRecipe) {
            return res.status(404).send("Recipe Not Found");
        }
        return res.status(200).send("Recipe Deleted");
    } catch (err) {
        console.log(err);
        res.status(500).send(' Failed To Delete');
    }
};

const updateRecipe = async (req, res) => {
    const { id } = req.params;
    const { name, description, imageUrl, cookTime, ingredients, allergens, utensils, nutrition, recommendations } = req.body;
    console.log(`Received ID: ${id}`);
    try {
        const updateRecipe = await Recipe.findByIdAndUpdate(
            id,
            {
                name, description, imageUrl, cookTime, ingredients, allergens, utensils, nutrition, recommendations
            },
            { new: true }

        );
        if (!updateRecipe) {
            return res.status(404).send("Recipe Not Found");
        }
        return res.status(200).send("Recipe Updated");
    } catch (err) {
        console.log(err);
        res.status(500).send(' Failed To Update');
    }
};

const sessionHandler = async(req, res) => {
    const {operation} = req.body;
    if (operation === 'validate-cart') {
        await validateCart(req, res);
    }
}

const validateCart = async(req, res) => {
    try {
        const mealID = req.body.itemID;
        if (!mongoose.Types.ObjectId.isValid(mealID)) {
            return res.status(400).json({ message: 'Invalid meal ID.' });
        }
        // Assuming user is stored in session
        const user = req.session.user;

        if (!user) {
            return res.status(400).json({ message: 'User not logged in.' });
        }

        // Ensure subPlan and dishes array exist
        if (!user.subPlan) {
            user.subPlan = { dishes: [] };
        } else if (!Array.isArray(user.subPlan.dishes)) {
            user.subPlan.dishes = [];
        }

        const limit = 4 * user.subPlan.numberOfMeals;

        // Check if the current number of items in the cart has reached the limit
        if (user.subPlan.dishes.length >= limit) {
            return res.status(400).json({ message: 'You have reached the limit of items for your plan.' });
        }

        // Add mealID to the user's subPlan.dishes array (in session only)
        user.subPlan.dishes.push(mealID);
        
        // Update session user
        req.session.user = user;
        console.log(req.session.user);

        return res.status(200).json({ message: 'Item added to cart.' });
    } catch (err) {
        console.error('Error validating cart:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};



module.exports = {
    getMenu,
    addRecipe,
    deleteRecipe,
    updateRecipe,
    sessionHandler
};