const recipesFromTag = (recipes, tags) => {
  const filtered = recipes.filter((recipe) => {
    return tags.every((tag => {
      return recipe.tags.includes(tag)
    }))
  })
  return filtered
}

const recipesfromName = (recipes, name) => {
  return recipes.filter((recipe) => {
    if (recipe.name.toLowerCase().includes(name.toLowerCase())) {
    return recipe.name
  }
})
}

const findRecipe = (recipeData, recipeName) => {
  const recipe = recipeData.find(({ name }) => name === recipeName);
  return recipe
};  

const displayIngredients = (recipeData, ingredientsData, recipeName) => {
  const recipe = findRecipe(recipeData, recipeName);
  let ingredients = [];
  if (recipe) {
    ingredients = recipe.ingredients.map((ingredient) => {
      const { id, quantity: { amount, unit } } = ingredient;
      const ingredientInfo = ingredientsData.find(ingredient => id === ingredient.id);
      const ingredientName = ingredientInfo.name
      return { name: ingredientName, amount, unit };
    });
  }
  return ingredients.map((ingredient) => `${ingredient.amount} ${ingredient.unit} of ${ingredient.name}`).join(", ");
}

const calculateRecipeCost = (recipe, ingredients) => {
  const totalCost = recipe.ingredients.reduce((acc, {id, quantity: {amount}}) => 
    acc + (amount / 100) * (ingredients.find(ingredient => ingredient.id === id).estimatedCostInCents), 0)
  return totalCost.toFixed(2);
}

const recipeInstructions = recipe => {
  const instructions = recipe.instructions.map(({ number, instruction }) => `${number}. ${instruction}`);
  return instructions.join(' ')
};


const shuffleData = (recipes) => {
  recipes.sort(() => Math.random() - 0.5)
  return
}

const recipesFromPrice = (recipes, maxCost, ingredients) => {
  return recipes.filter((recipe) => {
    const cost = calculateRecipeCost(recipe, ingredients);
    return cost <= maxCost;
  });
}

export {
  recipesFromTag,
  recipesfromName,
  findRecipe,
  calculateRecipeCost,
  recipeInstructions,
  shuffleData,
  displayIngredients,
  recipesFromPrice
}