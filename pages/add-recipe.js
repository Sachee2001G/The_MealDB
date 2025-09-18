import { useState, useEffect } from "react";
import Link from "next/link";

export default function AddRecipe() {
  const [recipe, setRecipe] = useState({
    name: "",
    category: "",
    area: "",
    instructions: "",
    image: "",
    ingredients: [""],
  });
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  // Load saved recipes
  useEffect(() => {
    const existingRecipes = JSON.parse(
      localStorage.getItem("customRecipes") || "[]"
    );
    setSavedRecipes(existingRecipes);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  const addIngredient = () => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe((prev) => ({
      ...prev,
      ingredients: newIngredients,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const existingRecipes = JSON.parse(
      localStorage.getItem("customRecipes") || "[]"
    );

    if (editingId) {
      // Update existing recipe
      const updatedRecipes = existingRecipes.map((r) =>
        r.id === editingId
          ? {
              ...recipe,
              id: editingId,
              ingredients: recipe.ingredients.filter(
                (ing) => ing.trim() !== ""
              ),
            }
          : r
      );
      localStorage.setItem("customRecipes", JSON.stringify(updatedRecipes));
      setSavedRecipes(updatedRecipes);
      setEditingId(null);
      setSuccessMessage("Recipe updated successfully!");
      setShowSuccess(true);
    } else {
      // Create new recipe
      const newRecipe = {
        ...recipe,
        id: Date.now().toString(),
        ingredients: recipe.ingredients.filter((ing) => ing.trim() !== ""),
      };
      const updatedRecipes = [...existingRecipes, newRecipe];
      localStorage.setItem("customRecipes", JSON.stringify(updatedRecipes));
      setSavedRecipes(updatedRecipes);
      setSuccessMessage("Recipe added successfully!");
      setShowSuccess(true);
    }

    // Reset form
    setRecipe({
      name: "",
      category: "",
      area: "",
      instructions: "",
      image: "",
      ingredients: [""],
    });

    // Hide success message after 3 sec
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const editRecipe = (recipeToEdit) => {
    setRecipe({
      name: recipeToEdit.name,
      category: recipeToEdit.category || "",
      area: recipeToEdit.area || "",
      instructions: recipeToEdit.instructions,
      image: recipeToEdit.image || "",
      ingredients:
        recipeToEdit.ingredients && recipeToEdit.ingredients.length > 0
          ? recipeToEdit.ingredients
          : [""],
    });
    setEditingId(recipeToEdit.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setRecipe({
      name: "",
      category: "",
      area: "",
      instructions: "",
      image: "",
      ingredients: [""],
    });
    setEditingId(null);
  };

  const confirmDelete = (recipeId) => {
    setShowDeleteConfirm(recipeId);
  };

  const deleteRecipe = (recipeId) => {
    const updatedRecipes = savedRecipes.filter(
      (recipe) => recipe.id !== recipeId
    );
    localStorage.setItem("customRecipes", JSON.stringify(updatedRecipes));
    setSavedRecipes(updatedRecipes);
    setShowDeleteConfirm(null);
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">The_Meal_DB</h1>
            <div className="space-x-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-yellow-600 font-medium"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="text-gray-700 hover:text-yellow-600 font-medium"
              >
                Search
              </Link>
              <Link
                href="/add-recipe"
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              >
                Add Recipe
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Back Button */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {editingId ? "Update Recipe" : "Add New Recipe"}
          </h2>
          <p className="text-gray-600 mt-2">
            {editingId
              ? "Edit your recipe details"
              : "Share your favorite recipe with others"}
          </p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg">
            {successMessage}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
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
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900"
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
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Dinner, Dessert, Breakfast"
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
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500"
                  placeholder="e.g., Italian, Mexican, American"
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
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500"
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500"
                    placeholder="e.g., 2 cups flour"
                    required={index === 0}
                  />
                  {recipe.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg  hover:bg-red-600 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredient}
                className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
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
                onChange={handleInputChange}
                required
                rows={8}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:border-blue-500"
                placeholder="Enter cooking instructions step by step..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end gap-4">
              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-bold transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 font-bold transition-colors"
              >
                {editingId ? "Update Recipe" : "Save Recipe"}
              </button>
            </div>
          </form>
        </div>

        {/* Saved Recipes */}
        {savedRecipes.length > 0 && (
          <div className="bg-white rounded-lg text-gray-900 shadow-md p-6">
            <h3 className="text-xl text-gray-900 font-bold mb-4">
              Your Saved Recipes ({savedRecipes.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedRecipes.map((savedRecipe) => (
                <div
                  key={savedRecipe.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">{savedRecipe.name}</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => editRecipe(savedRecipe)}
                        className="text-yellow-500 hover:text-yellow-700 text-sm font-medium"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => confirmDelete(savedRecipe.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Category:</strong>{" "}
                    {savedRecipe.category || "Not specified"}
                  </p>
                  <p className="text-gray-600 text-sm mb-2">
                    <strong>Origin:</strong>{" "}
                    {savedRecipe.area || "Not specified"}
                  </p>
                  <p className="text-gray-500 text-xs mb-3">
                    {savedRecipe.ingredients
                      ? savedRecipe.ingredients.length
                      : 0}{" "}
                    ingredients
                  </p>
                  {savedRecipe.image && (
                    <img
                      src={savedRecipe.image}
                      alt={savedRecipe.name}
                      className="w-full h-32 object-cover rounded mb-3"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  )}
                  <div className="mt-3">
                    <Link
                      href={`/custom-recipe/${savedRecipe.id}`}
                      className="text-blue-500 hover:text-yellow-700 text-sm font-medium"
                    >
                      View Full Recipe →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this recipe? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteRecipe(showDeleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
