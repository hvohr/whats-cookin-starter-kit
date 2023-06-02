//NOTE: Your DOM manipulation will occur in this file
import { recipesfromName, recipesFromTag, findRecipe, calculateRecipeCost, recipeInstructions, shuffleData, displayIngredients } from "../src/recipeUtils";
import { recipesToCook, saveRecipe, deleteRecipe, addSavedRecipesToUser } from "../src/userUtils";
import { getUsers, getIngredients, getRecipes, addPostRecipe } from "./apiCalls"

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
const saveWhiteHeartButton = document.querySelector('.save-recipe-button')
const savedRedHeartButton = document.querySelector('.saved-recipe-button')
const savedRecipesButton = document.querySelector('.saved-recipes')
const savedRecipeDisplay = document.querySelector('.saved-recipe-display')
const clearButton = document.querySelector('.clear-search-button')
const searchButton = document.querySelector('.search-button')

//Event Listeners

const startFetch = () => {
  Promise.all([getRecipes(), getUsers(), getIngredients()]).then((data) => {
    let usersData1 = data[1].users
    let ingredientsData1 = data[2].ingredients
    let recipesData1 = data[0].recipes


allRecipesButton.addEventListener('click', event => {
  showRecipes(event);
  addHiddenClass([saveWhiteHeartButton, savedRedHeartButton, savedRecipeDisplay, savedSearchInput, allRecipesButton])
  removeHiddenClass([searchInput, savedRecipesButton])
});

savedRecipesButton.addEventListener('click', () => {
  addHiddenClass([allRecipeDisplay, singleRecipeDisplay, saveWhiteHeartButton, savedRedHeartButton, frontRecipeDisplay, savedRecipesButton, searchInput]);
  removeHiddenClass([savedRecipeDisplay, savedSearchInput, allFilterDisplay, allRecipesButton]);
  let postDisplay = postToDisplay();
  console.log(postDisplay)
  showSavedRecipes(postDisplay);
})

const postToDisplay = () => {
  let newList = []
   currentUser.recipesToCook.forEach((recipeID) => {
      let findID = recipesData1.find((recipe) => recipe.id === recipeID)
      newList.push(findID)
  })
  return newList
}

saveWhiteHeartButton.addEventListener('click', event => {
  if (event.target.classList.contains('save-recipe-btn')) {      
    const recipeName = recipeTitle.innerText;
    saveRecipe(recipesData1, recipeName);
    const selectedRecipe = findRecipe(recipesData1, recipeName);
    currentUser.recipesToCook.push(selectedRecipe.id)
    addPostRecipe(selectedRecipe, currentUser); 
    removeHiddenClass([savedRedHeartButton]);
    addHiddenClass([saveWhiteHeartButton]);    
  }
})

allFilterDisplay.addEventListener('click', function (event) {
  if (event.target.classList.contains('checkbox')) {
    renderFilteredRecipes(event);
    renderFilteredSavedRecipes(event);
    addHiddenClass([saveWhiteHeartButton, savedRedHeartButton])
  }
  if (event.target.classList.contains('recipe')) {
    checkCurrentSavedRecipes(event)
    viewSelectedRecipe(event)
  }
});

searchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addHiddenClass([singleRecipeDisplay, saveWhiteHeartButton]);
    showSearchResults();
  }
});

savedSearchInput.addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    addHiddenClass([singleRecipeDisplay, savedRecipesButton]);
    showSavedSearchResults();
  }
})

searchButton.addEventListener('click', function () {
  addHiddenClass([singleRecipeDisplay, saveWhiteHeartButton, savedRedHeartButton]);
  if(savedSearchInput.classList[1] === 'hidden') {
    showSearchResults();
  } else if (searchInput.classList[1] === 'hidden') {
    showSavedSearchResults();
  }
});

clearButton.addEventListener('click', function (e) {
  savedSearchInput.value = ''
  searchInput.value = ''
  if (allRecipeDisplay.classList[1] === 'hidden') {
    showSavedRecipes(currentUser, recipesToCook)
  } else {
    showRecipes()
  }
})

allRecipeDisplay.addEventListener('click', event => {
  if (event.target.classList.contains('recipe')) {
    checkCurrentSavedRecipes(event)
    addHiddenClass([allRecipeDisplay]);
    removeHiddenClass([singleRecipeDisplay]);
    viewSelectedRecipe(event);
  };
});

frontRecipeDisplay.addEventListener('click', function (event) {
  if (event.target.classList.contains('recipe')) {
    checkCurrentSavedRecipes(event)
    addHiddenClass([allRecipeDisplay, frontRecipeDisplay, savedSearchInput, savedRecipeDisplay]);
    removeHiddenClass([singleRecipeDisplay, searchInput, allRecipesButton]);
    viewSelectedRecipe(event);
  }
});

savedRecipeDisplay.addEventListener('click', event => {
  if (event.target.classList.contains('recipe')) {
    addHiddenClass([savedRecipeDisplay, savedSearchInput]);
    removeHiddenClass([singleRecipeDisplay, savedRecipesButton]);
    checkCurrentSavedRecipes(event)
    viewSelectedRecipe(event);
  }
  if (event.target.classList.contains('delete-recipe-button')) {
    const recipeName = event.target.previousElementSibling.innerText;
    deleteRecipe(recipeName);
    addSavedRecipesToUser(currentUser, recipesToCook);
    showSavedRecipes(currentUser, recipesToCook);
  }
});


homeButton.addEventListener('click', function () {
  addHiddenClass([saveWhiteHeartButton, savedRedHeartButton, savedRecipeDisplay, singleRecipeDisplay, allFilterDisplay, savedSearchInput])
  removeHiddenClass([savedRecipesButton, searchInput, allRecipesButton])
  showHomePage();
  randomizeHomePage();
})

const generateRandomUser = users => {
  // currentUser = users[Math.floor(Math.random() * users.length)];
  currentUser = users[0];
  return currentUser
}

window.onload = randomizeHomePage(), generateRandomUser(usersData1)


//Event Handlers/Functions



function showSearchResults() {
  let searchValue = searchInput.value;
  removeHiddenClass([allRecipeDisplay, allFilterDisplay]);
  addHiddenClass([frontRecipeDisplay]);
  allRecipeDisplay.innerHTML = '';
    const searchedRecipes = recipesfromName(recipesData1, searchValue);
    if (!searchedRecipes.length) {
      allRecipeDisplay.innerHTML = `
        <div class="no-recipe-found-message">
          <p>Sorry, ${currentUser.name}, we currently don't have any matching recipes.</p>
        </div>`;
    } else {
      searchedRecipes.forEach(recipe => {
        allRecipeDisplay.innerHTML += `
          <div class="recipe-wrapper recipe" tabindex="0" id="${recipe.name}" >
            <img src="${recipe.image}" class="recipe" alt="${recipe.name}">
            <div class="recipe-info recipe">
              <p class="recipe">${recipe.name}</p>
            </div>
          </div>`;
      });
    };
};

const checkCurrentSavedRecipes = event => {
  let recipeID;
   recipesData1.forEach((recipe) => {
    if (recipe.name === event.target.parentElement.id) {
      recipeID = recipe.id
    }
    return recipeID
  })
  const recipeFound = currentUser.recipesToCook.some(recipe => recipe === recipeID);
  if (recipeFound) {
    removeHiddenClass([savedRedHeartButton]);
  } else {
    removeHiddenClass([saveWhiteHeartButton]);
  }
};

function showSavedSearchResults() {
  let searchValue = savedSearchInput.value;
  removeHiddenClass([allFilterDisplay]);
  addHiddenClass([frontRecipeDisplay]);
  savedRecipeDisplay.innerHTML = '';
  const filteredRecipes = recipesfromName(recipesToCook, searchValue);
  if (!filteredRecipes.length) {
    savedRecipeDisplay.innerHTML = `
      <div class="no-recipe-found-message">
        <p>Sorry, ${currentUser.name}, you currently don't recipes saved matching that description.</p>
      </div>`;
  } else {
    filteredRecipes.forEach(recipe => {
      savedRecipeDisplay.innerHTML += `
        <div class="recipe-wrapper recipe" tabindex="0" id="${recipe.name}">
          <img src="${recipe.image}" class="recipe alt="${recipe.name}">
          <div class="recipe-info recipe">
            <p class="recipe>${recipe.name}</p>
            <button class="delete-recipe-button ${recipe.name}" name="${recipe.name}">🗑️</button>
          </div>
        </div>`;
    });
  };
};

function showHomePage() {
  addHiddenClass([allRecipeDisplay], [allFilterDisplay]);
  removeHiddenClass([frontRecipeDisplay]);
}

const showSavedRecipes = (array) => {
  if (!array.length) {
    savedRecipeDisplay.innerHTML = `
    <div class="no-saved-recipes-message">
      <p> Hi, ${currentUser.name}! You currently have no saved recipes.</p>
    </div>`;
  } else {
    savedRecipeDisplay.innerHTML = '';
    array.forEach(recipe => {
      savedRecipeDisplay.innerHTML += `
      <div class="recipe-wrapper recipe" tabindex="0" id="${recipe.name}" >
        <img src="${recipe.image}" class="recipe" alt="${recipe.name}">
        <div class="recipe-info recipe">
          <p class="recipe">${recipe.name}</p>
          <button class="delete-recipe-button ${recipe.name}" name="${recipe.name}">🗑️</button>
        </div>
      </div>`});
  }
};

function renderFilteredSavedRecipes() {
  const savedTags = Array.from(checkCategories).filter((category) => category.checked).map(c => c.id)
  if (!savedTags.length && allRecipeDisplay.classList[1] === 'hidden') {
    showSavedRecipes(currentUser, recipesToCook);
    return
  }
  let savedFiltered = recipesFromTag(recipesToCook, savedTags);
  savedRecipeDisplay.innerHTML = '';
  savedFiltered.forEach(recipe => savedRecipeDisplay.innerHTML += ` 
    <div class="recipe-wrapper recipe" tabindex="0" id="${recipe.name}">
      <img src="${recipe.image}" class="recipe" alt="${recipe.name}">
      <div class="recipe-info recipe">
      <p class="recipe">${recipe.name}</p>
        <button class="delete-recipe-button ${recipe.name}" name="${recipe.name}">🗑️</button>
      </div>`)
  if (!savedFiltered.length) {
    savedRecipeDisplay.innerHTML = `
    <div class="no-recipe-found-message">
      <p>Sorry, ${currentUser.name}, no recipes match these tags.</p>
    </div>`
  };
};

function randomizeHomePage() {
    shuffleData(recipesData1)
    frontRecipeDisplay.innerHTML = '';
    for (let i = 0; i < recipesData1.length; i++) {
      frontRecipeDisplay.innerHTML = `
      <div class="recipe-wrapper recipe" tabindex="0" id="${recipesData1[0].name}">
      <img src="${recipesData1[0].image}" class="recipe" alt="${recipesData1[0].name}">
      <div class="recipe-info recipe">
        <p>${recipesData1[0].name}</p>
      </div>
      </div>
    <div class="recipe-wrapper recipe" tabindex="0" id="${recipesData1[1].name}">
      <img src="${recipesData1[1].image}" class="recipe" alt="${recipesData1[1].name}">
      <div class = "recipe-info recipe">
        <p>${recipesData1[1].name}</p>
      </div>
    </div>
    <div class = "recipe-wrapper recipe" tabindex="0" id="${recipesData1[2].name}" >
      <img src="${recipesData1[2].image}" class="recipe" alt="${recipesData1[2].name}">
      <div class = "recipe-info recipe">
        <p>${recipesData1[2].name}</p>
      </div>`
    }
  };

function renderFilteredRecipes() {
  const tags = Array.from(checkCategories).filter((category) => category.checked).map(c => c.id)
  if (!tags.length && savedRecipeDisplay.classList[1] === 'hidden') {
    showRecipes()
    return
  }
    let filtered = recipesFromTag(recipesData1, tags);
    allRecipeDisplay.innerHTML = '';
    filtered.forEach(recipe => allRecipeDisplay.innerHTML += `
    <div class="recipe-wrapper recipe" tabindex="0" id="${recipe.name}">
      <img src="${recipe.image}" class="recipe" alt="${recipe.name}">
      <div class="recipe-info recipe">
      <p class="recipe">${recipe.name}</p>
      </div>`)
    if (!filtered.length) {
      allRecipeDisplay.innerHTML = `
      <div class="no-recipe-found-message">
        <p>Sorry, ${currentUser.name}, no recipes match these tags.</p>
      </div>`
    }
  };

const viewSelectedRecipe = event => {
  removeHiddenClass([searchInput, allRecipesButton])
  singleRecipeDisplay.innerHTML = '';
      const recipeName = event.target.parentElement.id
      const selectedRecipe = findRecipe(recipesData1, recipeName);
      const recipeCost = calculateRecipeCost(selectedRecipe, ingredientsData1);
      const ingredientsInfo = displayIngredients(recipesData1, ingredientsData1, recipeName)
      const instructions = recipeInstructions(selectedRecipe);
      addHiddenClass([allFilterDisplay]);
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
    };

function showRecipes() {
  removeHiddenClass([allRecipeDisplay, allFilterDisplay]);
  addHiddenClass([frontRecipeDisplay, singleRecipeDisplay]);
  allRecipeDisplay.innerHTML = ''
  recipesData1.forEach(recipe => allRecipeDisplay.innerHTML += `
  <div class="recipe-wrapper recipe" tabindex="0" id="${recipe.name}">
    <img src="${recipe.image}" class="recipe" alt="${recipe.name}">
  <div class = "recipe-info recipe">
    <p class="recipe">${recipe.name}</p>
  </div>`);
  };

function removeHiddenClass(elements) {
  return elements.forEach(element => element.classList.remove('hidden'));
};

function addHiddenClass(elements) {
  return elements.forEach(element => element.classList.add('hidden'));
};

})
}

startFetch()

// export {
//   showRecipes,
//   removeHiddenClass,
//   addHiddenClass,
//   showHomePage,
//   randomizeHomePage
// }