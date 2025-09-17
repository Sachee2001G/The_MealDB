import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (q) {
      setSearchTerm(q);
      searchRecipes(q);
    }
  }, [q]);

  // To search for recipes based on query
  const searchRecipes = async (query) => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          query
        )}`
      );

      const data = await response.json();
      setRecipes(data.meals || []);
      setLoading(false);
    } catch (error) {
      console.log("Error searching recipes:", error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  // To search on the base of category like -> Dessert, Seafood, vegetarian etc.
  const searchByCategory = async (category) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
          categories
        )}`
      );
      const data = await response.json();

      setRecipes(data.meals || []);
      setLoading(false);
    } catch (error) {
      console.log("Error searching by category:", error);
      setLoading(false);
    }
  };
  // To search on the base of area like -> Nepali, Italian, Mexican, Chinese etc.
  const searchByArea = async (area) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
          areas
        )}`
      );
      const data = await response.json();
      setRecipes(data.meals || []);
      setLoading(false);
    } catch (error) {
      console.log("Error searching by area:", error);
      setLoading(false);
    }
  };
  // To get a random recipe
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

  const categories = [
    "Beef",
    "Chicken",
    "Dessert",
    "Pasta",
    "Seafood",
    "Vegetarian",
  ];
  const areas = [
    "Italian",
    "Mexican",
    "Chinese",
    "Indian",
    "French",
    "American",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              ← Back to Home
            </Link>
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
          <div>
            <h3 className="font-semibold mb-2">By Origin:</h3>
            <div className="flex flex-wrap gap-2">
              {areas.map((area) => (
                <button
                  key={area}
                  onClick={() => searchByArea(area)}
                  className="px-3 py-1 bg-green-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200"
                  disabled={loading}
                >
                  {area}
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
                      Origin: {recipe.strArea || "N/A"}
                    </p>
                    <Link
                      href={`/recipe/${recipe.idMeal}`}
                      className="inline-block w-full text-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      View Recipe
                    </Link>
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
