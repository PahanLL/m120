import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent {
  @Input() recipe!: Recipe;
  @Output() recipeDeleted = new EventEmitter<void>();
  isFavorite: boolean = false;

  constructor(private recipeService: RecipeService) {}

  ngOnInit(): void {
    this.isFavorite = !!this.recipeService.getFavoriteRecipes().find(r => r.id === this.recipe.id);
  }

  onDelete() {
    this.recipeService.deleteRecipe(this.recipe.id);
    this.recipeDeleted.emit();
  }
  get imageUrl(): string {
    if (this.recipe.imageFile) {
      return this.recipeService.getImageUrl(this.recipe.imageFile);
    }
    return 'assets/logo.png';
  }

  onToggleFavorite() {
    if (this.isFavorite) {
      this.recipeService.removeFromFavorites(this.recipe);
    } else {
      this.recipeService.addToFavorites(this.recipe);
    }
    this.isFavorite = !this.isFavorite;
  }
}
