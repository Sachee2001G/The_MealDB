import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetching the data
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch(
        searchTerm
          ? `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
              searchTerm
            )}`
          : "https://www.themealdb.com/api/json/v1/1/search.php?f=a"
      );
      const data = await response.json();
      setRecipes(data.meals || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // To Search the recipes

  const searchRecipe = async (searchValue) => {
    if (searchValue.trim() === "") {
      fetchRecipes();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          searchValue
        )}`
      );
      const data = await response.json();
      setRecipes(data.meals || []);
      setLoading(false);
    } catch (error) {
      console.error("Error searching recipes:", error);

      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchRecipe(searchTerm);
  };

  // Now making a UI for the given logic

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Recipe Finder
          </h1>
          <p className="text-gray-600 text-center mt-2">
            Discover amazing recipes from around the world
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <form onSubmit={handleSearch} className="max-w-md mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search for recipes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <Link
            href="/add-recipe"
            className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Add New Recipe
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading recipes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.map((recipe) => (
              <div
                key={recipe.idMeal}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <img
                  src={recipe.strMealThumb}
                  alt={recipe.strMeal}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-2">{recipe.strMeal}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Category: {recipe.strCategory}
                  </p>
                  <p className="text-gray-600 text-sm mb-4">
                    Origin: {recipe.strArea}
                  </p>
                  <Link
                    href={`/recipe/${recipe.idMeal}`}
                    className="inline-block w-full text-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && recipes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600">
              No recipes found. Try a different search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
