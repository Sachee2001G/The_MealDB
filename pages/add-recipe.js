import { useState } from 'react';
import Link from 'next/link';

export default function AddRecipe() { 
    const [recipe, setRecipe] = useState({
        name: '',
        category: '',
        area: '',   
        instructions: '',
        images: '',
        ingredients: ['']
    })

    const [savedRecipe, setSavedRecipe] = useState([]);
    const [showSucccess, setShowSuccess] = useState(false);

    // To handle Changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setRecipe((prev) => ({ ...prev, [name]: value }));
    }

    // TO add Ingridients
    const addIngredient = () => { 
        setRecipe((prev) => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
    }
 
    // To remove Ingridients
    //recipe.ingredients = ["Tomato", "Cheese", "Basil"];

    const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index)
    setRecipe(prev => ({
      ...prev,
      ingredients: newIngredients
    }))
    }
    
    // Submission

}