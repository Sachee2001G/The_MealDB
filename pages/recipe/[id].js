import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function RecipeDetail() { 
    const router = useRouter()
    const { id } = router.query
    const [recipe, setRecipe] = useState(null)
    //Debounce
    const [loading, setLoading] = useState(true)

    useEffect(() => { 
        if (id) {
            fetchRecipe()
        }
    }, [])
    
    // To fetch the recipe
    const fetchRecipe = async () => {
        try {
            setLoading(true)
            const response = await fetch(``)
            const data = await response.json()
            if (data.meals && data.meals[0]) {
                setRecipe(data.meals[0])

            }
            setLoading(false)

        } catch (error) {
            console.log('Error fetching recipe:', error)
            setLoading(false)
        }
    }
    
    
}
