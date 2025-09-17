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
    const Ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredients = recipe[`strIngredients${i}`];
      const measure = recipe[`strMeasure${i}`];

      if (ingredients && ingredients.trim() !== "") {
        Ingredients.push({ name: ingredients, measure: measure || "" });
      }
    }
    return Ingredients;
  };
}
