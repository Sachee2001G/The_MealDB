import { useState } from "react";
import Link from "next/link";

export default function AddRecipe() {
  const [recipe, setRecipe] = useState({
    name: "",
    category: "",
    area: "",
    instructions: "",
    images: "",
    ingredients: [""],
  });

  const [savedRecipes, setSavedRecipes] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  // To handle Changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  // To handle ingredient changes
  const handleIngredientChange = (index, value) => {
    setRecipe((prev) => {
      const updatedIngredients = [...prev.ingredients];
      updatedIngredients[index] = value;
      return { ...prev, ingredients: updatedIngredients };
    });
  };
  // TO add Ingridients
  const addIngredient = () => {
    setRecipe((prev) => ({ ...prev, ingredients: [...prev.ingredients, ""] }));
  };

  // To remove Ingridients
  //recipe.ingredients = ["Tomato", "Cheese", "Basil"];

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  // Submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // new Receipe with new ID

    const newRecipe = {
      ...recipe,
      id: Date.now().toString(),
      ingredients: recipe.ingredients.filter((ing) => ing.trim() !== ""),
    };

    // Get existing receipe from local storage
    const existingRecipes = JSON.parse(
      localStorage.getItem("customRecipes") || "[]"
    );

    // Add new recipe
    const updatedRecipes = [...existingRecipes, newRecipe];

    // Save to localStorage
    localStorage.setItem("customRecipes", JSON.stringify(updatedRecipes));

    setSavedRecipes(updatedRecipes);
    setShowSuccess(true);

    // Reset form
    setRecipe({
      name: "",
      category: "",
      area: "",
      instructions: "",
      images: "",
      ingredients: [""],
    });

    // Hide success message after 3 sec.
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

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
            ← Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">Add New Recipe</h1>
          <div></div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            Recipe added successfully!
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Recipe Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Recipe Name *
              </label>
              <input
                type="text"
                name="name"
                value={recipe.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter recipe name"
              />
            </div>

            {/* Category and Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={recipe.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Dinner, Dessert"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Origin/Area
                </label>
                <input
                  type="text"
                  name="area"
                  value={recipe.area}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Italian, Mexican"
                />
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Image URL
              </label>
              <input
                type="url"
                name="image"
                value={recipe.image}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="https://example.com/recipe-image.jpg"
              />
            </div>

            {/* Ingredients */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Ingredients *
              </label>
              {recipe.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) =>
                      handleIngredientChange(index, e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="e.g., 2 cups flour"
                    required={index === 0}
                  />
                  {recipe.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Add Ingredient
              </button>
            </div>

            {/* Instructions */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Instructions *
              </label>
              <textarea
                name="instructions"
                value={recipe.instructions}
                onChange={handleChange}
                required
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                placeholder="Enter cooking instructions step by step..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 bg-orange-200 text-white rounded-lg hover:bg-orange-300 font-bold"
              >
                Save Recipe
              </button>
            </div>
          </form>
        </div>

        {/* Saved Recipes Preview */}
        {savedRecipes.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Your Saved Recipes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedRecipes.slice(-3).map((savedRecipe) => (
                <div
                  key={savedRecipe.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <h4 className="font-bold">{savedRecipe.name}</h4>
                  <p className="text-gray-600 text-sm">
                    {savedRecipe.category} • {savedRecipe.area}
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    {savedRecipe.ingredients.length} ingredients
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
