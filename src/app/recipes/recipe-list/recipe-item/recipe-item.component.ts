import { Component, OnInit,Input, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../recipe/recipe.model';


@Component({
  selector: 'app-recipe-item',
  templateUrl: './recipe-item.component.html',
  styleUrls: ['./recipe-item.component.css']
})
export class RecipeItemComponent implements OnInit {

  

  ngOnInit() {
  }

 @Input() recipe : Recipe;
 @Input() index : number;

 //@Output()recipeSelected = new EventEmitter<void>();

//  onSelected(){
//   // this.recipeSelected.emit();
//   this.recipeService.recipeSelected.emit(this.recipe);
//  }
}
