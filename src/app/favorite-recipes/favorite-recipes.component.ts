import {Component, Input, OnInit} from '@angular/core';
import { RecipeService } from '../recipe.service';
import {Recipe} from "../recipe.model";

@Component({
  selector: 'app-favorite-recipes',
  templateUrl: './favorite-recipes.component.html',
  styleUrls: ['./favorite-recipes.component.css']
})

export class FavoriteRecipesComponent implements OnInit {
  favoriteRecipes: Recipe[] = [];
  @Input() recipe!: Recipe;
  constructor(public recipeService: RecipeService) { }

  ngOnInit(): void {
    this.favoriteRecipes = this.recipeService.getFavoriteRecipes();
  }

  get imageUrl(): string {
    if (this.recipe.imageFile) {
      return this.recipeService.getImageUrl(this.recipe.imageFile);
    }
    return 'assets/logo.png';
  }
}
