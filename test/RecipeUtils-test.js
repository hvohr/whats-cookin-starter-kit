import { expect } from 'chai';
import { recipesFromTag, recipesfromName, findRecipe, displayIngredients, calculateRecipeCost, recipeInstructions, shuffleData, recipesFromPrice } from '../src/recipeUtils';
import recipeData from '../src/data/recipes-sample.js';
import ingredientsData from '../src/data/ingredients-sample.js';
import { recipesToCook, saveRecipe } from '../src/userUtils';


describe('recipesFromTag', () => {
  let save, save2, expected, names;

  beforeEach(function() {
    save = saveRecipe(recipeData, 'Loaded Chocolate Chip Pudding Cookie Cups');
    save2 = saveRecipe(recipeData, 'Maple Dijon Apple Cider Grilled Pork Chops');
    expected = ['Thai Chicken Tenders with Broiled Pineapple Slaw', 'Maple Dijon Apple Cider Grilled Pork Chops'];
    names = ['Maple Dijon Apple Cider Grilled Pork Chops', 'Thai Chicken Tenders with Broiled Pineapple Slaw'];
  })

  it('Should be a function', () => {
    expect(recipesFromTag).to.be.a('function');
  });

  it ('Should filter recipes based on tag', () => {
    const expected = 'Loaded Chocolate Chip Pudding Cookie Cups'
    const filtered = recipesFromTag(recipeData, ['starter'])

    expect(filtered.length).to.equal(1)
    expect(filtered[0].name).to.equal(expected)
  });

  it('should filter recipesToCook based on a tag', ()=> {
    const expectedRecipesToCook = [recipeData[0]];
    const filteredRecipesToCook = recipesFromTag(recipesToCook, ['starter'])

    expect(filteredRecipesToCook.length).to.equal(1)
    expect(filteredRecipesToCook).to.deep.equal(expectedRecipesToCook)
  })

  it ('Should filter recipes if tag applies to multiple recipes', () => {
    const filtered = recipesFromTag(recipeData, ['lunch'])

    expect(filtered.length).to.equal(2)
    expect(names).to.have.members(expected)
  });

  it('Should filter recipesToCook if tag applies to multiple recipes', () => {
    const save3 = saveRecipe(recipeData, 'Thai Chicken Tenders with Broiled Pineapple Slaw')
    const expectedRecipesToCook2 = [recipeData[1], recipeData[3]]
    const filteredRecipesToCook2 = recipesFromTag(recipesToCook, ['main dish'])

    expect(filteredRecipesToCook2.length).to.equal(2)
    expect(filteredRecipesToCook2).to.deep.equal(expectedRecipesToCook2)
  });

  it ('Should filter recipes when multiple tags are applied', () => {
    const filtered = recipesFromTag(recipeData, ['lunch', 'main dish'])
    
    expect(filtered.length).to.equal(2)
    expect(names).to.have.members(expected)
  });
});

describe('recipesFromName', () => {
  it ('Should filter recipes based on name', () => {
    const filtered = recipesfromName(recipeData, 'Thai Chicken Tenders with Broiled Pineapple Slaw')

    expect(filtered.length).to.equal(1)
  })

  it ('Should filter recipes based on a similar name', () => {
    const expected = 'Thai Chicken Tenders with Broiled Pineapple Slaw'
    const filtered = recipesfromName(recipeData, 'chicken')

    expect(filtered.length).to.equal(1)
    expect(filtered[0].name).to.equal(expected)
  })

  it('Should filter recipesToCook based on name', () => {
    const filtered = recipesfromName(recipesToCook, 'Thai Chicken Tenders with Broiled Pineapple Slaw')

    expect(filtered.length).to.equal(1)
  })

  it ('Should return nothing if no recipes match the user input name', () => {
    const filtered = recipesfromName(recipeData, 'Spicy Potatoes')

    expect(filtered.length).to.equal(0)
  })
});

describe('findRecipe', () => {
  it('should be a function', () => {
    expect(findRecipe).to.be.a('function');
  });

  it('should return the correct recipe based on the recipe name', () => {
    const recipeName = 'Loaded Chocolate Chip Pudding Cookie Cups';
    const recipe = findRecipe(recipeData, recipeName);

    expect(recipe).to.deep.equal(recipeData[0]);
  });
});

describe('displayIngredients', () => {
  it('should be a function', () => {
    expect(findRecipe).to.be.a('function');
  });

  it("should return the ingredient's amount, units & ingredient name of a given recipe", () => {
    const recipeName = 'Loaded Chocolate Chip Pudding Cookie Cups';
    const ingredients = displayIngredients(recipeData, ingredientsData, recipeName);

    expect(ingredients).to.equal('1.5 c of wheat flour, 0.5 tsp of bicarbonate of soda, 1 large of eggs, 0.5 c of sucrose, 3 Tbsp of instant vanilla pudding, 0.5 c of brown sugar, 0.5 tsp of salt, 24 servings of fine sea salt, 2 c of semi sweet chips, 0.5 c of unsalted butter, 0.5 tsp of vanilla');
  });
});

describe('calculateRecipeCost', () => {
  it('should be a function', () => {
    expect(calculateRecipeCost).to.be.a('function');
  });

  it('should return the total cost of a recipe', () => {
    const recipe = recipeData[0];
    const expectedCost = '177.76';
    const actualCost = calculateRecipeCost(recipe, ingredientsData);

    expect(actualCost).to.equal(expectedCost);
  })
});

describe('recipeInstructions', () => {
  it('should be a function', () => {
    expect(recipeInstructions).to.be.a('function');
  });

  it('should return a given recipes instruction in numerical order', () => {
    const recipe = recipeData[0];
    const instructions = recipeInstructions(recipe);

    expect(instructions).to.equal('1. In a large mixing bowl, whisk together the dry ingredients (flour, pudding mix, soda and salt). Set aside.In a large mixing bowl of a stand mixer, cream butter for 30 seconds. Gradually add granulated sugar and brown sugar and cream until light and fluffy. 2. Add egg and vanilla and mix until combined. 3. Add dry ingredients and mix on low just until incorporated. Stir in chocolate chips.Scoop the dough into 1,5 tablespoon size balls and place on a plate or sheet. Cover with saran wrap and chill at least 2 hours or overnight.When ready to bake, preheat oven to 350 degrees. 4. Place the cookie dough balls into ungreased muffin pan. Sprinkle with sea salt. 5. Bake for 9 to 10 minutes, or until you see the edges start to brown. 6. Remove the pan from the oven and let sit for 10 minutes before removing onto a cooling rack.Top with ice cream and a drizzle of chocolate sauce.')
  });
});

describe('shuffleData', () => {
  it ('should randomize the recipe array order', () => {
    const shuffled = shuffleData(recipeData)
    
    expect(shuffled).to.not.equal(recipeData)  
  });
});

describe('recipesFromPrice', () => {
  it('should be a function', () => {
    expect(recipesFromPrice).to.be.a('function');
  });

  it('should filter recipes based on user budget', () => {
    const maxCost = (200);
    const recipes = recipeData;
    const ingredients = ingredientsData;
    const filteredRecipes = recipesFromPrice(recipes, maxCost, ingredients);
    
    expect(filteredRecipes.length).to.equal(2);
  });
});