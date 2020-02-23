import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipes/recipe-list/recipe/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map, tap } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class DataStorageService {


    constructor(private httpClient: HttpClient,
        private recipeService: RecipeService) {

    }

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        return this.httpClient.put(
            'https://ng-module-angular.firebaseio.com/recipes.json', recipes)
            .subscribe(
                response => {
                    console.log(response);
                }
            );
    }

    fetchRecipes() {
      return  this.httpClient.get<Recipe[]>(
            'https://ng-module-angular.firebaseio.com/recipes.json')
            .pipe(map(
                recipes => {
                    return recipes.map(recipes => {
                        return {
                            ...recipes,
                            ingredients: recipes.ingredients ? recipes.ingredients : []

                        }
                    });
                }
            ),tap(recipes => {
                this.recipeService.setRecipe(recipes);
            }))
            // .subscribe(
            //     recipes => {
            //         this.recipeService.setRecipe(recipes);
            //     }
            // );

    }
}