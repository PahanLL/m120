import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../recipe.service';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrls: ['./add-recipe.component.css']
})
export class AddRecipeComponent implements OnInit {
  recipeName: string = '';
  recipeDescription: string = '';
  ingredients: string = '';
  instructions: string = '';
  imageFile: File | null = null;
  imageData: string | null = null;


  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
  }

  addRecipe() {
    if (!this.isValid()) {
      alert('All fields are required!');
      return;
    }

    const newRecipe = new Recipe(
      Date.now().toString(),
      this.recipeName,
      this.recipeDescription,
      this.ingredients.split(',').map(ingredient => ingredient.trim()),
      this.instructions,
      this.imageFile
    );

    if (!newRecipe.imageFile) {
      alert('Image is required!');
      return;
    }

    this.recipeService.addRecipe(newRecipe);
    alert('Recipe added!');
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageFile = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        this.imageData = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  isValid(): boolean {
    return this.recipeName !== '' &&
      this.recipeDescription !== '' &&
      this.ingredients !== '' &&
      this.instructions !== '' &&
      this.imageFile !== null;
  }
}
