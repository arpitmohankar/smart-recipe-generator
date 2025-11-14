// src/services/recipeService.ts
import { generateRecipeWithLLM } from './clarifaiService';

export interface RecipeRequest {
  ingredients: string[];
  dietary?: string[];
  cuisine?: string;
  difficulty?: string;
}

export const processRecipeRequest = async (request: RecipeRequest): Promise<string> => {
  const preferences = [
    request.dietary && `Dietary: ${request.dietary.join(', ')}`,
    request.cuisine && `Cuisine: ${request.cuisine}`,
    request.difficulty && `Difficulty: ${request.difficulty}`
  ].filter(Boolean).join(', ');

  const response = await generateRecipeWithLLM(request.ingredients, preferences);
  return response;
};

export const refineRecipe = async (
  currentRecipe: string, 
  userFeedback: string
): Promise<string> => {
  const refinementPrompt = `Current recipe: ${currentRecipe}
  
  User feedback: ${userFeedback}
  
  Please refine the recipe based on the user's feedback.`;

  const response = await generateRecipeWithLLM([], refinementPrompt);
  return response;
};
