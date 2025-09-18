# The MealDB App

### This is a simple Next.js application for browsing, viewing, and adding recipes.

## Getting Started

1. ### Clone the repository
2. ### Install dependencies:

   ### npm install

   ### npm run dev

## File structure:

recipe-app/

├── components/

│ └── Layout.js

├── pages/

│ ├── \_app.js

│ ├── index.js

│ ├── search.js

│ ├── add-recipe.js

│ └── recipe/

│ └── [id].js

└── styles/

    └── globals.css

## Key Features Implemented:

1. Recipe List Page - Shows popular recipes from API
2. Recipe Detail Page - Complete recipe with ingredients & instructions
3. Add Recipe Form - Create custom recipes stored locally
4. Search & Filter - Search by name, category, area
5. Responsive Design - Works on all devices
6. Navigation - Clean header and footer
7. Local Storage - Save custom recipes

## Open the browser to go:

http://localhost:3000/
→ Home page (browse recipes)

http://localhost:3000/recipe/[id]
→ Recipe detail pages for other IDs

http://localhost:3000/recipe/52773
→ Example recipe detail page (recipe ID 52773, 52773, 52768)

http://localhost:3000/add-recipe
→ Add a custom recipe page

http://localhost:3000/search
→ To search for items

## Common Pages

### Home Page → Lists meals/recipes

### Recipe Detail Page → Shows details of a specific recipe

### Add Recipe → Form to add your own custom recipe , Update and Delete

### Custom Recipes → Recipes saved to local storage
