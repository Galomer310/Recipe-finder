// Get references to form and DOM elements
const form = document.getElementById('ingredients-form');
const ingredientsInput = document.getElementById('ingredients');
const recipesDiv = document.getElementById('recipes');
const sensitivityButtons = document.querySelectorAll('.sensitivity-button');

// Store selected sensitivities
let selectedSensitivities = [];

// Add event listeners to sensitivity buttons
sensitivityButtons.forEach(button => {
    button.addEventListener('click', () => {
        const sensitivity = button.dataset.sensitivity;

        if (selectedSensitivities.includes(sensitivity)) {
            // If already selected, remove it
            selectedSensitivities = selectedSensitivities.filter(s => s !== sensitivity);
            button.classList.remove('selected'); // Remove highlight
        } else {
            // Add to selected sensitivities
            selectedSensitivities.push(sensitivity);
            button.classList.add('selected'); // Highlight button
        }
    });
});

// Handle form submission
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page reload
    console.log('Form submitted'); // Debugging log

    const ingredients = ingredientsInput.value.split(',').map(item => item.trim()); // Parse ingredients

    // Check if ingredients are provided
    if (ingredients.length === 0) {
        console.log('No ingredients provided');
        recipesDiv.innerHTML = `<p class="error">Please provide at least one ingredient.</p>`;
        return;
    }

    // Debugging log for ingredients and sensitivities
    console.log('Ingredients:', ingredients);
    console.log('Sensitivities:', selectedSensitivities);

    // Fetch recipes from server
    try {
        const response = await fetch('http://localhost:3000/api/recipes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ingredients,
                sensitivities: selectedSensitivities,
                additional: true,
                additionalLimit: 5,
            }),
        });

        if (!response.ok) {
            throw new Error('Error fetching recipes');
        }

        const recipes = await response.json();
        displayRecipes(recipes); // Update UI with recipes
    } catch (error) {
        console.error('Error in fetch request:', error); // Log detailed error
        recipesDiv.innerHTML = `<p class="error">Could not fetch recipes. Please try again.</p>`;
    }
});

// Display recipes on the page
function displayRecipes(recipes) {
    recipesDiv.innerHTML = ''; // Clear previous recipes

    if (recipes.length === 0) {
        recipesDiv.innerHTML = '<p>No recipes found. Try different ingredients or sensitivities.</p>';
        return;
    }

    recipes.forEach(recipe => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');
        recipeCard.innerHTML = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <a href="${recipe.sourceUrl}" target="_blank">View Recipe</a>
        `;
        recipesDiv.appendChild(recipeCard);
    });
}
