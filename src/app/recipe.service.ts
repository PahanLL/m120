import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[];
  private favorites: Recipe[] = [];
  constructor() {
    const savedRecipes = localStorage.getItem('recipes');

    if (savedRecipes) {
      const parsedRecipes = JSON.parse(savedRecipes);
      this.recipes = parsedRecipes.map((recipe: any) => {
        const { id, name, description, ingredients, instructions, image } = recipe;
        let imageFile = null;
        if (image) {
          imageFile = this.dataURLtoFile(image, `recipe_${id}.jpg`);
        }
        return new Recipe(id, name, description, ingredients, instructions, imageFile);
      });
    } else {
      this.recipes = [
        new Recipe(
          '1',
          'Spaghetti Bolognese',
          'Delicious spaghetti with minced meat and tomato sauce.',
          ['Spaghetti', 'Minced meat', 'Tomato sauce'],
          'Boil the spaghetti. Cook the minced meat. Mix everything with the tomato sauce.',
          null
        ),
        new Recipe(
          '2',
          'Chicken Curry',
          'Tasty chicken curry with coconut milk.',
          ['Chicken', 'Curry powder', 'Coconut milk'],
          'Cook the chicken. Add curry powder. Add coconut milk.',
          null
        ),
      ];
    }
    const savedFavorites = localStorage.getItem('favoriteRecipes');
    if (savedFavorites) {
      const parsedFavorites = JSON.parse(savedFavorites);
      this.favorites = parsedFavorites.map((recipe: any) => {
        const { id, name, description, ingredients, instructions, image } = recipe;
        let imageFile = null;
        if (image) {
          imageFile = this.dataURLtoFile(image, `recipe_${id}.jpg`);
        }
        return new Recipe(id, name, description, ingredients, instructions, imageFile);
      });
    }
  }

  addToFavorites(recipe: Recipe) {
    this.favorites.push(recipe);
    this.updateLocalStorage();
  }

  removeFromFavorites(recipe: Recipe) {
    this.favorites = this.favorites.filter(r => r.id !== recipe.id);
    this.updateLocalStorage();
  }

  getFavoriteRecipes(): Recipe[] {
    return this.favorites;
  }

  dataURLtoFile(dataurl: string | null | undefined, filename: string): File | null {
    if (!dataurl) {
      return null;
    }
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch || arr.length < 2) {
      return null;
    }
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while(n--){
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
  }

  getImageUrl(imageFile: File | null): string {
    if (imageFile) {
      return URL.createObjectURL(imageFile);
    }
    return '';
  }

  private async updateLocalStorage() {
    const recipesForStorage = await Promise.all(this.recipes.map(async recipe => {
      const { id, name, description, ingredients, instructions, imageFile } = recipe;
      const imageData = await this.fileToDataURL(imageFile);
      return {
        id, name, description, ingredients, instructions,
        image: imageData
      };
    }));
    localStorage.setItem('recipes', JSON.stringify(recipesForStorage));
    const favoritesForStorage = await Promise.all(this.favorites.map(async recipe => {
      const { id, name, description, ingredients, instructions, imageFile } = recipe;
      const imageData = await this.fileToDataURL(imageFile);
      return {
        id, name, description, ingredients, instructions,
        image: imageData
      };
    }));
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoritesForStorage));
  }


  private fileToDataURL(file: File | null): Promise<string | null> {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      reader.readAsDataURL(file);
    });
  }

  getRecipes() {
    return this.recipes;
  }

  getRecipe(id: string) {
    return this.recipes.find((recipe) => recipe.id === id);
  }

  async addRecipe(recipe: Recipe) {
    if (recipe.imageFile) {
      try {
        const base64String = await this.readFileAsDataURL(recipe.imageFile);
        const newRecipe = { ...recipe, imageFile: null, image: base64String };
        this.recipes.push(newRecipe);
        this.updateLocalStorage();
      } catch (error) {
        console.error("Error reading the file:", error);
      }
    } else {
      this.recipes.push(recipe);
      this.updateLocalStorage();
    }
  }

  readFileAsDataURL(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result as string);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  updateRecipe(id: string, updatedRecipe: Recipe) {
    const index = this.recipes.findIndex((recipe) => recipe.id === id);
    this.recipes[index] = updatedRecipe;
    this.updateLocalStorage();
  }

  deleteRecipe(id: string) {
    this.recipes = this.recipes.filter((recipe) => recipe.id !== id);
    this.updateLocalStorage();
    return this.recipes;
  }
}
