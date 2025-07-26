# Recipe Finder - Spoonacular API Setup

This guide explains how to connect the Recipe Finder to the Spoonacular Recipe API.

## Spoonacular API Setup

### 1. Get API Key
1. Visit [Spoonacular Food API](https://spoonacular.com/food-api)
2. Click "Get Started" and create a free account
3. Go to your dashboard and copy your API key
4. Free tier includes 150 requests per day

### 2. Environment Variables
Add to your `.env` file:

```env
VITE_SPOONACULAR_API_KEY=your_actual_api_key_here
```

### 3. API Features Available

#### Recipe Search
- **Text Search**: Search by recipe names, cuisine, diet
- **Ingredients Search**: Find recipes using ingredients you have
- Advanced filtering options
- Nutritional information
- Recipe instructions and ingredients

#### Search Parameters
- **Query**: Search term (e.g., "pasta", "chicken")
- **Diet**: vegetarian, vegan, gluten-free, keto, paleo
- **Cuisine**: italian, chinese, mexican, indian, french
- **Type**: main course, dessert, appetizer, salad, soup
- **Max Ready Time**: Maximum cooking time in minutes
- **Min Health Score**: Health score from 1-100

#### Recipe Information
- Title and description
- Cooking time and servings
- Health and popularity scores
- Price per serving
- Nutritional data
- Step-by-step instructions
- Ingredient lists with quantities

### 4. Rate Limits

**Free Plan:**
- 150 requests/day
- 1 request/second

**Paid Plans:**
- Higher limits available
- More features (meal planning, wine pairing, etc.)

### 5. API Endpoints Used

#### Complex Search (Text Search)
```
GET /recipes/complexSearch
```
Parameters:
- query: search term
- diet: dietary restriction
- cuisine: cuisine type
- type: meal type
- maxReadyTime: max cooking time
- minHealthScore: minimum health score
- number: results per page (max 100)
- addRecipeInformation: include detailed info

#### Find by Ingredients (Ingredients Search)
```
GET /recipes/findByIngredients
```
Parameters:
- ingredients: comma-separated list of ingredients
- number: number of recipes (max 100)
- ranking: maximize used ingredients (1) or minimize missing (2)

#### Random Recipes
```
GET /recipes/random
```
Parameters:
- number: number of recipes (max 100)
- tags: filter by tags

#### Recipe Information
```
GET /recipes/{id}/information
```
Returns detailed recipe information including:
- Ingredients with quantities
- Step-by-step instructions
- Nutritional information
- Equipment needed

### 6. Error Handling

The app includes error handling for:
- Invalid API key (402)
- Rate limit exceeded (429)
- Recipe not found (404)
- Network errors
- Invalid search parameters

### 7. Demo Mode

When no API key is provided, the app shows:
- Sample recipes with realistic data
- All UI functionality working
- Perfect for portfolio demonstrations

### 8. Features Implemented

#### Search & Filtering
- Text search with autocomplete
- Advanced filter panel
- Diet and cuisine filters
- Cooking time and health score filters
- Clear filters functionality

#### Recipe Display
- Grid layout with recipe cards
- Recipe images and ratings
- Cooking time and serving info
- Price per serving
- Cuisine and diet badges

#### Recipe Details
- Full-screen recipe modal
- Detailed nutritional information
- Ingredient lists
- Cooking instructions
- Recipe ratings and reviews

#### User Experience
- Loading skeletons
- Error handling with retry
- Responsive design
- Offline support
- Success/error notifications

### 9. Alternative APIs

Other recipe APIs you can integrate:
- Edamam Recipe Search API
- TheMealDB API
- Recipe Puppy API
- Yummly API

### 10. Security Notes

- Store API keys in environment variables
- Never commit API keys to version control
- Monitor usage to avoid rate limits
- Consider implementing request caching

## Quick Start

1. **Get API Key**: [spoonacular.com/food-api](https://spoonacular.com/food-api)
2. **Add to .env**: `VITE_SPOONACULAR_API_KEY=your_key_here`
3. **Restart Server**: The app will automatically detect and use the API
4. **Start Cooking**: Search for your favorite recipes!

The Recipe Finder showcases advanced API integration, complex filtering, and modern UI patterns perfect for impressing potential employers!
