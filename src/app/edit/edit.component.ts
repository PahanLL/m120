// edit.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  recipeId:string = '';
  recipeName = '';
  recipeDescription = '';
  ingredients = '';
  instructions = '';
  imageFile: File | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.recipeId = params['id'];
      const recipe = this.recipeService.getRecipe(this.recipeId);

      if (recipe) {
        this.recipeName = recipe.name;
        this.recipeDescription = recipe.description;
        this.ingredients = recipe.ingredients.join(', ');
        this.instructions = recipe.instructions;
        this.imageFile || null;
      }
    });
  }

  isValid(): boolean {
    return !!this.recipeName && !!this.recipeDescription && !!this.ingredients && !!this.instructions;
  }

  updateRecipe() {
    if (!this.isValid()) {
      alert('All fields are required!');
      return;
    }

    const updatedRecipe: Recipe = new Recipe(
      this.recipeId,
      this.recipeName,
      this.recipeDescription,
      this.ingredients.split(', '),
      this.instructions,
      this.imageFile
    );

    this.recipeService.updateRecipe(this.recipeId, updatedRecipe);
    alert('Recipe updated successfully!');

    this.router.navigate(['/list']);
  }
}
