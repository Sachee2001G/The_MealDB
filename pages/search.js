import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customRecipes, setCustomRecipes] = useState([]);

  // Load custom recipes on component mount
  useEffect(() => {
    const savedRecipes = JSON.parse(
      localStorage.getItem("customRecipes") || "[]"
    );
    setCustomRecipes(savedRecipes);
  }, []);

  useEffect(() => {
    if (q) {
      setSearchTerm(q);
      searchRecipes(q);
    }
  }, [q, customRecipes]);

  const searchRecipes = async (query) => {
    if (!query.trim()) return;

    try {
      setLoading(true);

      // Search API recipes
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
      );
      const data = await response.json();
      const apiRecipes = data.meals || [];

      // Search custom recipes
      const filteredCustomRecipes = customRecipes.filter(
        (recipe) =>
          recipe.name.toLowerCase().includes(query.toLowerCase()) ||
          recipe.category.toLowerCase().includes(query.toLowerCase()) ||
          recipe.origin.toLowerCase().includes(query.toLowerCase()) ||
          recipe.ingredients.some((ingredient) =>
            ingredient.toLowerCase().includes(query.toLowerCase())
          )
      );

      // Convert custom recipes to API format for consistency
      const formattedCustomRecipes = filteredCustomRecipes.map((recipe) => ({
        idMeal: `custom-${recipe.id}`,
        strMeal: recipe.name,
        strMealThumb:
          recipe.image ||
          "https://via.placeholder.com/300x200?text=Custom+Recipe",
        strCategory: recipe.category,
        strOrigin: recipe.origin,
        isCustom: true,
      }));

      // Combine both results
      const allRecipes = [...apiRecipes, ...formattedCustomRecipes];
      setRecipes(allRecipes);
      setLoading(false);
    } catch (error) {
      console.log("Error searching recipes:", error);
      setLoading(false);
    }
  };

  const searchByFirstLetter = async (letter) => {
    try {
      setLoading(true);

      // Search API recipes by first letter
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?f=${encodeURIComponent(
          letters
        )}`
      );
      const data = await response.json();
      const apiRecipes = data.meals || [];

      // Search custom recipes by first letter
      const filteredCustomRecipes = customRecipes.filter(
        (recipe) => recipe.name.toLowerCase().charAt(0) === letter.toLowerCase()
      );

      // Convert custom recipes to API format
      const formattedCustomRecipes = filteredCustomRecipes.map((recipe) => ({
        idMeal: `custom-${recipe.id}`,
        strMeal: recipe.name,
        strMealThumb:
          recipe.image ||
          "https://via.placeholder.com/300x200?text=Custom+Recipe",
        strCategory: recipe.category,
        strArea: recipe.origin,
        isCustom: true,
      }));

      // Combine results
      const allRecipes = [...apiRecipes, ...formattedCustomRecipes];
      setRecipes(allRecipes);
      setLoading(false);
    } catch (error) {
      console.log("Error searching by first letter:", error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const searchByCategory = async (category) => {
    try {
      setLoading(true);

      // Search API recipes by category
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
          category
        )}`
      );
      const data = await response.json();
      const apiRecipes = data.meals || [];

      // Search custom recipes by category
      const filteredCustomRecipes = customRecipes.filter((recipe) =>
        recipe.category.toLowerCase().includes(category.toLowerCase())
      );

      // Convert custom recipes to API format
      const formattedCustomRecipes = filteredCustomRecipes.map((recipe) => ({
        idMeal: `custom-${recipe.id}`,
        strMeal: recipe.name,
        strMealThumb:
          recipe.image ||
          "https://via.placeholder.com/300x200?text=Custom+Recipe",
        strCategory: recipe.category,
        strArea: recipe.origin,
        isCustom: true,
      }));

      // Combine results
      const allRecipes = [...apiRecipes, ...formattedCustomRecipes];
      setRecipes(allRecipes);
      setLoading(false);
    } catch (error) {
      console.log("Error searching by category:", error);
      setLoading(false);
    }
  };

  const searchByOrigin = async (origin) => {
    try {
      setLoading(true);

      // Search API recipes by origin
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
          areas
        )}`
      );
      const data = await response.json();
      const apiRecipes = data.meals || [];

      // Search custom recipes by origin
      const filteredCustomRecipes = customRecipes.filter((recipe) =>
        recipe.origin.toLowerCase().includes(origin.toLowerCase())
      );

      // Convert custom recipes to API format
      const formattedCustomRecipes = filteredCustomRecipes.map((recipe) => ({
        idMeal: `custom-${recipe.id}`,
        strMeal: recipe.name,
        strMealThumb:
          recipe.image ||
          "https://via.placeholder.com/300x200?text=Custom+Recipe",
        strCategory: recipe.category,
        strArea: recipe.origin,
        isCustom: true,
      }));

      // Combine results
      const allRecipes = [...apiRecipes, ...formattedCustomRecipes];
      setRecipes(allRecipes);
      setLoading(false);
    } catch (error) {
      console.log("Error searching by origin:", error);
      setLoading(false);
    }
  };

  const getRandomRecipe = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/random.php"
      );
      const data = await response.json();
      if (data.meals && data.meals[0]) {
        router.push(`/recipe/${data.meals[0].idMeal}`);
      }
      setLoading(false);
    } catch (error) {
      console.log("Error getting random recipe:", error);
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipe) => {
    if (recipe.isCustom) {
      router.push(`/custom-recipe/${recipe.idMeal.replace("custom-", "")}`);
    } else {
      router.push(`/recipe/${recipe.idMeal}`);
    }
  };

  const categories = [
    "Beef",
    "Chicken",
    "Dessert",
    "Pasta",
    "Seafood",
    "Vegetarian",
    "Miscellaneous",
    "side",
    "Breakfast",
    "Goat",
    "lamb",
    "pasta",
    "beef",
  ];
  const areas = [
    "American",
    "British",
    "Canadian",
    "Chinese",
    "Croatian",
    "Dutch",
    "Egyptian",
    "French",
    "Greek",
    "Indian",
    "Irish",
    "Italian",
    "Jamaican",
    "Japanese",
    "Kenyan",
    "Malaysian",
    "Mexican",
    "Moroccan",
    "Polish",
    "Portuguese",
    "Russian",
    "Spanish",
    "Thai",
    "Tunisian",
    "Turkish",
    "Unknown",
    "Vietnamese",
  ];
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ← Back to Home
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Search Recipes</h1>
            <button
              onClick={getRandomRecipe}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
              disabled={loading}
            >
              Random Recipe
            </button>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                disabled={loading}
              >
                Search
              </button>
            </div>
          </form>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Quick Filters */}
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Quick Filters</h2>

          {/* Categories */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">By Category:</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => searchByCategory(category)}
                  className="px-3 py-1 bg-blue-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200"
                  disabled={loading}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Areas */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">By Area:</h3>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <button
                  key={area}
                  onClick={() => searchByOrigin(area)}
                  className="px-3 py-1 bg-green-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200"
                  disabled={loading}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* First Letter Filter */}
          <div className="mb-4">
            <h3 className="font-semibold mb-2">By First Letter:</h3>
            <div className="flex flex-wrap gap-2">
              {letters.map((letters) => (
                <button
                  key={letters}
                  onClick={() => searchByFirstLetter(letters)}
                  className="px-3 py-1 bg-purple-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200"
                  disabled={loading}
                >
                  {letters}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div>
          {q && (
            <h2 className="text-xl font-bold mb-4">
              Search Results for "{q}" ({recipes.length} found)
            </h2>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="loading-spinner mx-auto mb-4"></div>
              <p className="text-gray-600">Searching recipes...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recipes.map((recipe) => (
                <div
                  key={recipe.idMeal}
                  className="bg-white rounded-lg shadow-md overflow-hidden recipe-card"
                >
                  <img
                    src={recipe.strMealThumb}
                    alt={recipe.strMeal}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{recipe.strMeal}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Category: {recipe.strCategory || "N/A"}
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      Area: {recipe.strArea || "N/A"}
                    </p>
                    <button
                      onClick={() => handleRecipeClick(recipe)}
                      className="inline-block w-full text-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      View Recipe
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && recipes.length === 0 && q && (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">No recipes found for "{q}"</p>
              <p className="text-gray-500 text-sm">
                Try searching for something else or use the filters above
              </p>
            </div>
          )}

          {!loading && recipes.length === 0 && !q && (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-600 mb-4">
                Use the search bar or quick filters to find recipes
              </p>
              <p className="text-gray-500 text-sm">
                Try searching for ingredients, dish names, or use our category
                filters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
