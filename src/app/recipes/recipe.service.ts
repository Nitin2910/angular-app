import { Recipe } from './recipe-list/recipe/recipe.model';
import { EventEmitter, Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingService } from '../shopping-list/shopping.service';
import { Subject } from 'rxjs';


@Injectable()
export class RecipeService {


    recipeChangedEvent = new Subject<Recipe[]>();
    // private recipes: Recipe[] = [
    //     new Recipe('A Test', 'Test',
    //         'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
    //         [new Ingredient('Meat', 1), new Ingredient('Chicken', 2)
    //         ])
    // ];
    private recipes: Recipe[] = [];
    constructor(private shoppingService: ShoppingService) {

    }

    setRecipe(recipe: Recipe[]) {
        this.recipes = recipe;
        this.recipeChangedEvent.next(this.recipes.slice());
    }
    getRecipes() {
        return this.recipes.slice();
    }

    getRecipe(id: number) {
        return this.recipes[id];
    }

    addToShoppingList(ingredient: Ingredient[]) {
        this.shoppingService.addIngredients(ingredient);
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipeChangedEvent.next(this.recipes.slice());
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipeChangedEvent.next(this.recipes.slice());
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipeChangedEvent.next(this.recipes.slice());
    }
}