import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Recipe } from '../recipes/recipe-list/recipe/recipe.model';
import { RecipeService } from '../recipes/recipe.service';
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
@Injectable({ providedIn: 'root' })
export class DataStorageService {


    constructor(private httpClient: HttpClient,
        private recipeService: RecipeService,
        private authService: AuthService) {

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
        //return this.authService.user.pipe(take(1), exhaustMap(user => {
            return this.httpClient.get<Recipe[]>(
                'https://ng-module-angular.firebaseio.com/recipes.json').pipe(map(
                    recipes => {
                        return recipes.map(recipes => {
                            return {
                                ...recipes,
                                ingredients: recipes.ingredients ? recipes.ingredients : []

                            };
                        });
                    }
                ), tap(recipes => {
                    this.recipeService.setRecipe(recipes);
                })
                );

            
        }
}
