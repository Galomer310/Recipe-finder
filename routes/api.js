require('dotenv').config(); // This line should be at the top of your api.js

const express = require('express');
const axios = require('axios');
const router = express.Router();


// Session data to store recipe history
const sessionData = {
    recipeHistory: [],
};

// Route to fetch recipes
router.post('/api/recipes', async (req, res) => {
    const { ingredients, sensitivities, additional, additionalLimit, page = 1 } = req.body;

    // Validate ingredients
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
        return res.status(400).json({ error: 'Ingredients are required and must be an array.' });
    }

    // Validate sensitivities
    if (!sensitivities || !Array.isArray(sensitivities)) {
        return res.status(400).json({ error: 'Sensitivities must be an array.' });
    }

    try {
        // Make request to Spoonacular API
        const response = await axios.get(
            'https://api.spoonacular.com/recipes/complexSearch',
            {
                params: {
                    apiKey: process.env.SPOONACULAR_API_KEY,
                    includeIngredients: ingredients.join(','),
                    intolerances: sensitivities.join(','),
                    number: 10,
                    offset: (page - 1) * 20, // Pagination offset
                    addRecipeInformation: true,
                    fillIngredients: true,
                },
            }
        );

        let recipes = response.data.results;

        // Handle additional recipe limit
        if (additional && additionalLimit > 0) {
            recipes = recipes.slice(0, additionalLimit); // Limit additional recipes
        }

        // Save recipes to session history
        sessionData.recipeHistory.push({
            timestamp: new Date(),
            recipes,
        });

        // Send back the recipe results
        res.json(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error.message);
        res.status(500).json({ error: 'Error fetching recipes. Please try again later.' });
    }
});


// Route to get recipe history
router.get('/api/history', (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    const startIndex = (page - 1) * limit;
    const paginatedHistory = sessionData.recipeHistory.slice(startIndex, startIndex + limit);
    res.json(paginatedHistory.reverse());
});

module.exports = router;
