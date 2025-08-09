const init_ing = "water,salt,black pepper";
const data_recipe_template = document.querySelector("[data-recipe-template]");
const data_recipe_container = document.querySelector("[data-recipe-container]");
const data_ingredients_search = document.querySelector("[data-ingredients-search]");

let recipes = [];

function runSearch(ingredients_search_input) {

	const input_ingredients = ingredients_search_input.split(",").map(i => i.trim()).filter(i => i.length > 0);
	
	recipes.forEach(recipe => {

	    const recipeIngredients = recipe.ingredients.map(ing => ing.toLowerCase());
	
	    const matching_ingredients = recipeIngredients.filter(recipeIng =>
	    	input_ingredients.some(userIng => 
	    		(` ${recipeIng} `).includes(` ${userIng.toLowerCase()} `)
	    	)
	    );
	    
	    const missing_ingredients = recipeIngredients.filter(recipeIng =>
			!input_ingredients.some(userIng => 
	        	(` ${recipeIng} `).includes(` ${userIng.toLowerCase()} `)
	    	)
	    );
	
	    const recipe_ingredients = recipe.element.querySelector("[data-recipe-ingredients]");
	
		recipe_ingredients.innerHTML = [
			matching_ingredients.length > 0 ? matching_ingredients.map(ing => `<span>${ing}</span>`).join('<br>') : '',
			missing_ingredients.length > 0 ? missing_ingredients.map(ing => `<span style="color: tomato;">${ing}</span>`).join('<br>') : ''
		].filter(Boolean).join('<br>');
	
		const missing_count = missing_ingredients.length;
		const matching_count = matching_ingredients.length;
	    recipe.missing_count = missing_count;
	    recipe.matching_count = matching_count;

	});
	
	const sortedRecipes = [...recipes].sort((a, b) => {
	    
		if (a.missing_count !== b.missing_count) {
			return a.missing_count - b.missing_count; 
	    } else {
			return b.ingredients.length - a.ingredients.length; 
	    }
	
	});
	
	data_recipe_container.innerHTML = ""; 
	
	sortedRecipes.forEach(recipe => {
		data_recipe_container.appendChild(recipe.element);
	});
}

data_ingredients_search.addEventListener("input", e => {
	runSearch(data_ingredients_search.value);
});

document.addEventListener("DOMContentLoaded", () => {
    fetch("data/recipes.json")
        .then(res => res.json())
        .then(data => {
            recipes = data.recipes
                .filter(recipe => Array.isArray(recipe.ingredients) && recipe.ingredients.some(i => typeof i === "string" && i.trim().length > 0))
                .map(recipe => {
                    // clone template into a "card"
                    const recipe_card = data_recipe_template.content.cloneNode(true).children[0];
                    
                    // get card elements
                    const recipe_name = recipe_card.querySelector("[data-recipe-name]");
                    const recipe_url = recipe_card.querySelector("[data-recipe-url]");
                    const recipe_ingredients = recipe_card.querySelector("[data-recipe-ingredients]");
                
                    // set values in card 
                    recipe_name.textContent = recipe.name;
                    recipe_name.href = recipe.url;
                    
                    data_recipe_container.append(recipe_card);
                    
                    return {
                        name: recipe.name,
                        ingredients: recipe.ingredients,
                        element: recipe_card,
                    };
                });
            
            data_ingredients_search.value = init_ing;
            runSearch(data_ingredients_search.value);
        });
});
