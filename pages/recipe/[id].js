import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function RecipeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [recipe, setRecipe] = useState(null);
  //Debounce
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchRecipe();
    }
  }, [id]);

  // To fetch the recipe
  const fetchRecipe = async () => {
    try {
      setLoading(true);
      // From the_meal_db
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
      );
      const data = await response.json();
      if (data.meals && data.meals[0]) {
        setRecipe(data.meals[0]);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error fetching recipe:", error);
      setLoading(false);
    }
  };

  const getIngredients = () => {
    if (!recipe) return [];
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== "") {
        ingredients.push({ name: ingredient, measure: measure || "" });
      }
    }
    return ingredients;
  };

  const formatInstructions = (instructions) => {
    if (!instructions) return [];
    return instructions.split("\n").filter((step) => step.trim() !== "");
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Recipe not found</p>
          <Link
            href="/"
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx>{`
        input,
        textarea {
          color: #1f2937; /* Tailwind's gray-800 for dark text */
        }
      `}</style>
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ← Back to Recipes
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Recipe Details</h1>
          <div></div>
        </div>
      </header>

      {/* Recipe Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg text-gray-600 shadow-md overflow-hidden">
          {/* Recipe Image and Title */}
          <div className="md:flex">
            <div className="md:w-1/2">
              <img
                src={recipe.strMealThumb}
                alt={recipe.strMeal}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-6">
              <h2 className="text-3xl font-bold mb-4">{recipe.strMeal}</h2>
              <div className="space-y-2 text-gray-600">
                <p>
                  <strong>Category:</strong> {recipe.strCategory}
                </p>
                <p>
                  <strong>Origin:</strong> {recipe.strArea}
                </p>
                {recipe.strTags && (
                  <p>
                    <strong>Tags:</strong> {recipe.strTags}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Ingredients Section */}
          <div className="p-6 border-t">
            <h3 className="text-2xl text-gray-600 font-bold mb-4">
              Ingredients
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {getIngredients().map((ingredient, index) => (
                <div
                  key={index}
                  className="flex justify-between p-2 bg-gray-50 rounded"
                >
                  <span>{ingredient.name}</span>
                  <span className="text-gray-600">{ingredient.measure}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Section */}
          <div className="p-6 border-t">
            <h3 className="text-2xl font-bold mb-4">Instructions</h3>
            <div className="space-y-4">
              {formatInstructions(recipe.strInstructions).map((step, index) => (
                <div key={index} className="flex">
                  <span className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-1 flex-shrink-0">
                    {index + 1}
                  </span>
                  <p className="text-gray-700">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
