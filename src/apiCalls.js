
const getRecipes = () => {
  return fetch('http://localhost:3001/api/v1/recipes')
    .then((response => response.json()))
    .then((data) => { return data })
    .catch((error) => alert(error))
}

const getUsers = () => {
  return fetch('http://localhost:3001/api/v1/users')
  .then((response => response.json()))
  .then((data) => { return data })
  .catch((error) => alert(error))
}

const getIngredients = () => {
  return fetch('http://localhost:3001/api/v1/ingredients')
    .then((response => response.json()))
    .then((data) => { return data })
    .catch((error) => alert(error))
}

const addPostRecipe = (postRecipe, currentUser) => {
  fetch('http://localhost:3001/api/v1/usersRecipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSavedRecipe(postRecipe, currentUser))
  })
  .then(response => response.json())
  .catch(error => alert(error))
}

const newSavedRecipe = (recipe, currentUser) => { 
  return {
    userID: currentUser.id, 
    recipeID: recipe.id 
  }
}


export {
  addPostRecipe,
  getUsers,
  getIngredients,
  getRecipes
}