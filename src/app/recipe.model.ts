export class Recipe {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public ingredients: string[],
    public instructions: string,
    public imageFile: File | null
  ) {}
}
