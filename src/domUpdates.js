//NOTE: Your DOM manipulation will occur in this file
import { recipesfromName, recipesFromTag, findRecipe, calculateRecipeCost, recipeInstructions, shuffleData, displayIngredients } from "../src/recipeUtils";
import { recipesToCook, saveRecipe, deleteRecipe, addSavedRecipesToUser } from "../src/userUtils";
import { getData } from "./apiCalls"

var currentUser;

// Query Selectors:
const allRecipesButton = document.querySelector('.all-recipes');
const frontRecipeDisplay = document.querySelector('.front-recipe-display');
const allRecipeDisplay = document.querySelector('.all-recipes-display');
const allFilterDisplay = document.querySelector('.all-filters');
const checkCategories = document.getElementsByName('checkbox');
const searchInput = document.getElementById('search-bar');
const savedSearchInput = document.getElementById('saved-search-bar')
const recipeTitle = document.querySelector('h2');
const singleRecipeDisplay = document.querySelector('.single-recipe-display');
const homeButton = document.querySelector('.title')
const saveRecipeButton = document.querySelector('.save-recipe-button')
const savedRecipesButton = document.querySelector('.saved-recipes')
const savedRecipeDisplay = document.querySelector('.saved-recipe-display')
const clearButton = document.querySelector('.clear-search-button')

//Event Listeners

allRecipesButton.addEventListener('click', event => {
  showRecipes(event);
  addHiddenClass([saveRecipeButton, savedRecipeDisplay, savedSearchInput])
  removeHiddenClass([searchInput])


});

savedRecipesButton.addEventListener('click', () => {
  addHiddenClass([allRecipeDisplay, singleRecipeDisplay, saveRecipeButton, frontRecipeDisplay, searchInput]);
  removeHiddenClass([savedRecipeDisplay, savedSearchInput, allFilterDisplay]);
  showSavedRecipes(currentUser, recipesToCook);
})

saveRecipeButton.addEventListener('click', event => {
  getData('recipes').then(({ recipes }) => {
    if (event.target.classList.contains('save-recipe-btn')) {
      const recipeName = recipeTitle.innerText;
      addSavedRecipesToUser(currentUser, recipesToCook)
      saveRecipe(recipes, recipeName);
    }
  })
});


allFilterDisplay.addEventListener('click', function (event) {
  if (event.target.classList.contains('checkbox')) {
    renderFilteredRecipes(event)
    renderFilteredSavedRecipes(event)
  }
});

searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    showSearchResults();
  }
});

savedSearchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    showSavedSearchResults();
  }
})

clearButton.addEventListener('click', function (e) {
  savedSearchInput.value = ''
  searchInput.value = ''
  if (allRecipeDisplay.classList[1] === 'hidden') {
    showSavedRecipes(currentUser, recipesToCook)
  } else {
    showRecipes()
  }
})

allRecipeDisplay.addEventListener('click', function (event) {
  if (event.target.classList.contains('recipe')) {
    addHiddenClass([allRecipeDisplay]);
    removeHiddenClass([singleRecipeDisplay, saveRecipeButton]);
    viewSelectedRecipe(event);
  }
});

frontRecipeDisplay.addEventListener('click', function (event) {
  if (event.target.classList.contains('recipe')) {
    addHiddenClass([allRecipeDisplay, frontRecipeDisplay, savedSearchInput]);
    removeHiddenClass([singleRecipeDisplay, saveRecipeButton]);
    viewSelectedRecipe(event);
  }
});

savedRecipeDisplay.addEventListener('click', event => {
  if (event.target.classList.contains('recipe')) {
    addHiddenClass([savedRecipeDisplay, savedSearchInput]);
    removeHiddenClass([singleRecipeDisplay]);
    viewSelectedRecipe(event);
  }
  if (event.target.classList.contains('delete-recipe-button')) {
    const recipeName = event.target.id;
    deleteRecipe(recipeName)
    addSavedRecipesToUser(currentUser, recipesToCook)
    showSavedRecipes(currentUser, recipesToCook)
  }
});


homeButton.addEventListener('click', function () {
  showHomePage()
  randomizeHomePage()
})

window.addEventListener('load', () => {
  randomizeHomePage();
  getData('users').then(({ users }) => {
    generateRandomUser(users);
  })
})

//Event Handlers/Functions

const generateRandomUser = users => {
  currentUser = users[Math.floor(Math.random() * users.length)];
  return currentUser
}

function showSearchResults() {
  let searchValue = searchInput.value;
  removeHiddenClass([allRecipeDisplay, allFilterDisplay]);
  addHiddenClass([frontRecipeDisplay]);
  allRecipeDisplay.innerHTML = '';
  getData('recipes').then(({ recipes }) => {
    const searchedRecipes = recipesfromName(recipes, searchValue);
    if (searchedRecipes.length === 0) {
      allRecipeDisplay.innerHTML = `
        <div class="no-recipe-found-message">
          <p>Sorry, ${currentUser.name}, we currently don't have any matching recipes.</p>
        </div>`;
    } else {
      searchedRecipes.forEach(recipe => {
        allRecipeDisplay.innerHTML += `
          <div class="recipe-wrapper">
            <img id="${recipe.name}" src="${recipe.image}" class="recipe">
            <div class="recipe-info">
              <p>${recipe.name}</p>
            </div>
          </div>`;
      });
    };
  });
};

function showSavedSearchResults() {
  let searchValue = savedSearchInput.value;
  removeHiddenClass([allFilterDisplay]);
  addHiddenClass([frontRecipeDisplay]);
  savedRecipeDisplay.innerHTML = '';
  const filteredRecipes = recipesfromName(recipesToCook, searchValue);
  if (filteredRecipes.length === 0) {
    savedRecipeDisplay.innerHTML = `
      <div class="no-recipe-found-message">
        <p>Sorry, ${currentUser.name}, you currently don't recipes saved matching that description.</p>
      </div>`;
  } else {
    filteredRecipes.forEach(recipe => {
      savedRecipeDisplay.innerHTML += `
        <div class="recipe-wrapper">
          <img id="${recipe.name}" src="${recipe.image}" class="recipe">
          <div class="recipe-info">
            <p>${recipe.name}</p>
          </div>
        </div>`;
    });
  };
};

function showHomePage() {
  addHiddenClass([allRecipeDisplay], [allFilterDisplay]);
  removeHiddenClass([frontRecipeDisplay]);
};

const showSavedRecipes = (currentUser, recipesToCook) => {
  if (recipesToCook.length === 0) {
    savedRecipeDisplay.innerHTML = `
    <div class="no-saved-recipes-message">
      <p> Hi, ${currentUser.name}! You currently have no saved recipes.</p>
    </div>`;
  } else {
    savedRecipeDisplay.innerHTML = '';
    recipesToCook.forEach(recipe => {
      savedRecipeDisplay.innerHTML += `
      <div class="recipe-wrapper">
        <img id="${recipe.name}" src="${recipe.image}" class="recipe" alt="${recipe.name}">
        <div class="recipe-info">
          <p>${recipe.name}</p>
          <button class="delete-recipe-button ${recipe.name}" id="${recipe.name}">🗑️</button>
        </div>
      </div>`});
  };
};

function renderFilteredSavedRecipes() {
  const savedTags = Array.from(checkCategories).filter((category) => category.checked).map(c => c.id)
  if (savedTags.length === 0 && allRecipeDisplay.classList[1] === 'hidden') {
    showSavedRecipes(currentUser, recipesToCook);
    return
  }
  let savedFiltered = recipesFromTag(recipesToCook, savedTags);
  savedRecipeDisplay.innerHTML = '';
  savedFiltered.forEach(recipe => savedRecipeDisplay.innerHTML += `<div class = "recipe-wrapper">
      <img id="${recipe.name}" src="${recipe.image}" class="recipe">
      <div class = "recipe-info">
        <p>${recipe.name}</p>
      </div>`)
};

function randomizeHomePage() {
  getData('recipes').then(({ recipes }) => {
    shuffleData(recipes)
    frontRecipeDisplay.innerHTML = '';
    for (let i = 0; i < recipes.length; i++) {
      frontRecipeDisplay.innerHTML = `
      <div class = "recipe-wrapper">
        <img id="${recipes[0].name}" src="${recipes[0].image}" class="recipe">
        <div class = "recipe-info">
          <p>${recipes[0].name}</p>
        </div>
        </div>
      <div class = "recipe-wrapper">
        <img id="${recipes[1].name}" src="${recipes[1].image}"  class="recipe">
        <div class = "recipe-info">
          <p>${recipes[1].name}</p>
        </div>
      </div>
      <div class = "recipe-wrapper">
        <img id="${recipes[2].name}" src="${recipes[2].image}"  class="recipe">
        <div class = "recipe-info">
          <p>${recipes[2].name}</p>
        </div>`
    }
  })
}

function renderFilteredRecipes() {
  const tags = Array.from(checkCategories).filter((category) => category.checked).map(c => c.id)
  if (tags.length === 0 && savedRecipeDisplay.classList[1] === 'hidden') {
    showRecipes()
    return
  }
  getData('recipes').then(({ recipes }) => {
    let filtered = recipesFromTag(recipes, tags);
    allRecipeDisplay.innerHTML = '';
    filtered.forEach(recipe => allRecipeDisplay.innerHTML += `<div class = "recipe-wrapper">
      <img id="${recipe.name}" src="${recipe.image}" class="recipe">
      <div class = "recipe-info">
        <p>${recipe.name}</p>
      </div>`)
  })
};

const viewSelectedRecipe = event => {
  getData('ingredients').then(({ ingredients }) => {
    getData('recipes').then(({ recipes }) => {
      const recipeName = event.target.id;
      const selectedRecipe = findRecipe(recipes, recipeName);
      const recipeCost = calculateRecipeCost(selectedRecipe, ingredients);
      const ingredientsInfo = displayIngredients(recipes, ingredients, recipeName)
      const instructions = recipeInstructions(selectedRecipe);
      addHiddenClass([allFilterDisplay]);
      singleRecipeDisplay.innerHTML = '';
      singleRecipeDisplay.innerHTML += `
  <div class="recipe-page-header">
    <h2>${selectedRecipe.name}</h2>
    <img class="single-recipe-img" id="${selectedRecipe.id}" src="${selectedRecipe.image}" class="recipe" alt='${selectedRecipe.name}'>
  </div>
  <div class="recipe-page-body">
    <p class="total-cost-box">This recipe costs a total of: $${recipeCost} to make!</p>
    <p class="ingredient-box">The ingredients you will need to make this recipe are: <br> ${ingredientsInfo}</p>
    <p class="instruction-box">Instructions: <br> ${instructions}</p>
  </div>`;
      recipeTitle.innerText = `${selectedRecipe.name}`;
    })
  })
}

function showRecipes() {
  removeHiddenClass([allRecipeDisplay, allFilterDisplay]);
  addHiddenClass([frontRecipeDisplay, singleRecipeDisplay]);
  allRecipeDisplay.innerHTML = ''
  getData('recipes').then(({ recipes }) => {
    recipes.forEach(recipe => allRecipeDisplay.innerHTML += `
  <div class = "recipe-wrapper">
    <img id="${recipe.name}" src="${recipe.image}" class="recipe">
  <div class = "recipe-info">
    <p>${recipe.name}</p>
  </div>`);
  })
};

function removeHiddenClass(elements) {
  return elements.forEach(element => element.classList.remove('hidden'));
};

function addHiddenClass(elements) {
  return elements.forEach(element => element.classList.add('hidden'));
};

export {
  showRecipes,
  removeHiddenClass,
  addHiddenClass,
  showHomePage,
  randomizeHomePage
}