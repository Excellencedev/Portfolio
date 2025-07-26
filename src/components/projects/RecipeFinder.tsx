import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Clock, Users, Heart, ChefHat, Leaf, Filter, X, Plus, Trash2 } from 'lucide-react';
import ProjectLayout from './ProjectLayout';

interface Recipe {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  cuisines: string[];
  diets: string[];
  dishTypes: string[];
  spoonacularScore: number;
  healthScore: number;
  pricePerServing: number;
  nutrition?: {
    calories: number;
    protein: string;
    fat: string;
    carbs: string;
  };
}

interface SearchFilters {
  diet: string;
  cuisine: string;
  type: string;
  maxReadyTime: string;
  minHealthScore: string;
}

const RecipeFinder = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchMode, setSearchMode] = useState<'text' | 'ingredients'>('text');
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    diet: '',
    cuisine: '',
    type: '',
    maxReadyTime: '',
    minHealthScore: ''
  });

  // Spoonacular API configuration
  const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY || 'demo_key';
  const BASE_URL = 'https://api.spoonacular.com/recipes';

  useEffect(() => {
    // Load trending recipes on component mount
    if (API_KEY && API_KEY !== 'demo_key') {
      loadTrendingRecipes();
    } else {
      loadMockRecipes();
    }

    // Monitor network status
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadMockRecipes = () => {
    const mockRecipes: Recipe[] = [
      {
        id: 1,
        title: "Spaghetti Carbonara",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400",
        readyInMinutes: 20,
        servings: 4,
        summary: "Classic Italian pasta dish with eggs, cheese, and pancetta.",
        cuisines: ["Italian"],
        diets: [],
        dishTypes: ["main course"],
        spoonacularScore: 95,
        healthScore: 75,
        pricePerServing: 250
      },
      {
        id: 2,
        title: "Chicken Tikka Masala",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
        readyInMinutes: 45,
        servings: 6,
        summary: "Creamy and flavorful Indian curry with tender chicken pieces.",
        cuisines: ["Indian"],
        diets: ["gluten free"],
        dishTypes: ["main course"],
        spoonacularScore: 92,
        healthScore: 80,
        pricePerServing: 320
      },
      {
        id: 3,
        title: "Caesar Salad",
        image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400",
        readyInMinutes: 15,
        servings: 2,
        summary: "Fresh romaine lettuce with classic Caesar dressing and croutons.",
        cuisines: ["American"],
        diets: ["vegetarian"],
        dishTypes: ["salad", "side dish"],
        spoonacularScore: 88,
        healthScore: 85,
        pricePerServing: 180
      }
    ];
    setRecipes(mockRecipes);
  };

  const loadTrendingRecipes = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(
        `${BASE_URL}/random?number=12&apiKey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to load trending recipes');
      }
      
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (err: any) {
      setError('Failed to load trending recipes');
      loadMockRecipes(); // Fallback to mock data
    } finally {
      setLoading(false);
    }
  };

  const addIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim().toLowerCase())) {
      setIngredients([...ingredients, currentIngredient.trim().toLowerCase()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(ing => ing !== ingredient));
  };

  const searchRecipes = async () => {
    if (searchMode === 'text' && !searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    if (searchMode === 'ingredients' && ingredients.length === 0) {
      setError('Please add at least one ingredient');
      return;
    }

    try {
      setLoading(true);
      setError('');

      if (API_KEY && API_KEY !== 'demo_key') {
        let url: string;

        if (searchMode === 'ingredients') {
          // Use ingredients search endpoint
          const ingredientsList = ingredients.join(',+');
          url = `${BASE_URL}/findByIngredients?ingredients=${encodeURIComponent(ingredientsList)}&number=12&apiKey=${API_KEY}`;

          // For ingredients search, we need to get additional recipe information
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Failed to search recipes by ingredients');
          }

          const data = await response.json();

          // Get detailed information for each recipe
          const detailedRecipes = await Promise.all(
            data.slice(0, 8).map(async (recipe: any) => {
              try {
                const detailResponse = await fetch(
                  `${BASE_URL}/${recipe.id}/information?apiKey=${API_KEY}`
                );
                if (detailResponse.ok) {
                  return await detailResponse.json();
                }
                return recipe;
              } catch {
                return recipe;
              }
            })
          );

          setRecipes(detailedRecipes);
        } else {
          // Regular text search
          url = `${BASE_URL}/complexSearch?query=${encodeURIComponent(searchQuery)}&number=12&addRecipeInformation=true&apiKey=${API_KEY}`;

          // Add filters to URL
          if (filters.diet) url += `&diet=${filters.diet}`;
          if (filters.cuisine) url += `&cuisine=${filters.cuisine}`;
          if (filters.type) url += `&type=${filters.type}`;
          if (filters.maxReadyTime) url += `&maxReadyTime=${filters.maxReadyTime}`;
          if (filters.minHealthScore) url += `&minHealthScore=${filters.minHealthScore}`;

          const response = await fetch(url);

          if (!response.ok) {
            throw new Error('Failed to search recipes');
          }

          const data = await response.json();
          setRecipes(data.results || []);
        }
      } else {
        // Mock search results
        if (searchMode === 'ingredients') {
          // Filter mock recipes based on ingredients (simplified)
          const filteredMockRecipes = recipes.filter(recipe =>
            ingredients.some(ingredient =>
              recipe.title.toLowerCase().includes(ingredient) ||
              recipe.summary?.toLowerCase().includes(ingredient)
            )
          );
          setRecipes(filteredMockRecipes.length > 0 ? filteredMockRecipes : recipes.slice(0, 3));
        } else {
          const filteredMockRecipes = recipes.filter(recipe =>
            recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.cuisines.some(cuisine => cuisine.toLowerCase().includes(searchQuery.toLowerCase()))
          );
          setRecipes(filteredMockRecipes);
        }
      }
    } catch (err: any) {
      setError('Failed to search recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setFilters({
      diet: '',
      cuisine: '',
      type: '',
      maxReadyTime: '',
      minHealthScore: ''
    });
  };

  const clearAll = () => {
    setSearchQuery('');
    setIngredients([]);
    setCurrentIngredient('');
    clearFilters();
    setSearchMode('text');
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <ProjectLayout
      title="Recipe Finder"
      description="Discover delicious recipes with advanced search and filtering"
      githubUrl="https://github.com/yourusername/recipe-finder"
      technologies={["React", "TypeScript", "Spoonacular API", "Tailwind CSS", "Recipe Search"]}
    >
      <div className="max-w-7xl mx-auto">
        {/* Network Status */}
        {!isOnline && (
          <Card className="mb-6 bg-destructive/10 border-destructive/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">Offline</Badge>
                <span className="text-sm text-destructive">
                  You're currently offline. Showing cached recipes.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search Section */}
        <Card className="mb-6 glass-card">
          <CardContent className="p-6">
            {/* Search Mode Toggle */}
            <div className="flex gap-2 mb-4">
              <Button
                variant={searchMode === 'text' ? 'default' : 'outline'}
                onClick={() => setSearchMode('text')}
                size="sm"
              >
                <Search size={16} />
                Text Search
              </Button>
              <Button
                variant={searchMode === 'ingredients' ? 'default' : 'outline'}
                onClick={() => setSearchMode('ingredients')}
                size="sm"
              >
                <ChefHat size={16} />
                Ingredients Search
              </Button>
            </div>

            {/* Text Search */}
            {searchMode === 'text' && (
              <div className="flex gap-3 mb-4">
                <Input
                  placeholder="Search for recipes... (e.g., pasta, chicken, vegetarian)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchRecipes()}
                  className="flex-1"
                  disabled={loading}
                />
                <Button
                  onClick={searchRecipes}
                  disabled={loading || !searchQuery.trim()}
                >
                  <Search size={20} />
                  {loading ? 'Searching...' : 'Search'}
                </Button>
              </div>
            )}

            {/* Ingredients Search */}
            {searchMode === 'ingredients' && (
              <div className="space-y-4 mb-4">
                <div className="flex gap-3">
                  <Input
                    placeholder="Add an ingredient... (e.g., chicken, tomatoes, pasta)"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
                    className="flex-1"
                    disabled={loading}
                  />
                  <Button
                    onClick={addIngredient}
                    disabled={loading || !currentIngredient.trim()}
                    variant="outline"
                  >
                    <Plus size={20} />
                    Add
                  </Button>
                </div>

                {/* Ingredients List */}
                {ingredients.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Your Ingredients ({ingredients.length}):</p>
                    <div className="flex flex-wrap gap-2">
                      {ingredients.map((ingredient, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1 px-3 py-1"
                        >
                          {ingredient}
                          <button
                            onClick={() => removeIngredient(ingredient)}
                            className="ml-1 hover:text-destructive"
                          >
                            <X size={14} />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  onClick={searchRecipes}
                  disabled={loading || ingredients.length === 0}
                  className="w-full"
                >
                  <Search size={20} />
                  {loading ? 'Finding Recipes...' : `Find Recipes with ${ingredients.length} Ingredient${ingredients.length !== 1 ? 's' : ''}`}
                </Button>

                {/* Ingredients Search Tips */}
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Tips:</strong> Add ingredients you have at home. The more specific, the better!
                    Try "chicken breast", "cherry tomatoes", or "fresh basil" instead of just "chicken", "tomatoes", "basil".
                  </p>
                </div>
              </div>
            )}

            {/* Filters Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                size="sm"
              >
                <Filter size={16} />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Diet</label>
                    <select 
                      value={filters.diet} 
                      onChange={(e) => setFilters({...filters, diet: e.target.value})}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      <option value="">Any</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="gluten free">Gluten Free</option>
                      <option value="ketogenic">Keto</option>
                      <option value="paleo">Paleo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Cuisine</label>
                    <select 
                      value={filters.cuisine} 
                      onChange={(e) => setFilters({...filters, cuisine: e.target.value})}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      <option value="">Any</option>
                      <option value="italian">Italian</option>
                      <option value="chinese">Chinese</option>
                      <option value="mexican">Mexican</option>
                      <option value="indian">Indian</option>
                      <option value="french">French</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Type</label>
                    <select 
                      value={filters.type} 
                      onChange={(e) => setFilters({...filters, type: e.target.value})}
                      className="w-full p-2 border rounded-md text-sm"
                    >
                      <option value="">Any</option>
                      <option value="main course">Main Course</option>
                      <option value="dessert">Dessert</option>
                      <option value="appetizer">Appetizer</option>
                      <option value="salad">Salad</option>
                      <option value="soup">Soup</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Max Time (min)</label>
                    <Input
                      type="number"
                      placeholder="e.g., 30"
                      value={filters.maxReadyTime}
                      onChange={(e) => setFilters({...filters, maxReadyTime: e.target.value})}
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 block">Min Health Score</label>
                    <Input
                      type="number"
                      placeholder="1-100"
                      value={filters.minHealthScore}
                      onChange={(e) => setFilters({...filters, minHealthScore: e.target.value})}
                      className="text-sm"
                    />
                  </div>
                </div>
                
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X size={16} />
                  Clear Filters
                </Button>
              </div>
            )}

            {error && (
              <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recipe Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="glass-card">
                <div className="h-48 bg-muted animate-pulse rounded-t-lg"></div>
                <CardContent className="p-4">
                  <div className="h-4 bg-muted animate-pulse rounded mb-2"></div>
                  <div className="h-3 bg-muted animate-pulse rounded mb-4"></div>
                  <div className="flex gap-2 mb-3">
                    <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                    <div className="h-6 w-16 bg-muted animate-pulse rounded"></div>
                  </div>
                  <div className="h-8 bg-muted animate-pulse rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="glass-card hover:shadow-lg transition-all duration-200 cursor-pointer group"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-primary/90 text-primary-foreground">
                      {recipe.spoonacularScore || 85}/100
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                    {recipe.title}
                  </h3>

                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {truncateText(recipe.summary?.replace(/<[^>]*>/g, '') || 'Delicious recipe', 80)}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{recipe.readyInMinutes}m</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{recipe.servings}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart size={16} />
                      <span>{recipe.healthScore || 75}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {recipe.cuisines?.slice(0, 2).map((cuisine, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {cuisine}
                      </Badge>
                    ))}
                    {recipe.diets?.slice(0, 1).map((diet, index) => (
                      <Badge key={index} className="text-xs bg-green-100 text-green-800">
                        <Leaf size={12} className="mr-1" />
                        {diet}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                      {formatPrice(recipe.pricePerServing || 200)} per serving
                    </span>
                    <Button size="sm" variant="outline">
                      View Recipe
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && recipes.length === 0 && (
          <Card className="glass-card text-center py-12">
            <CardContent>
              <ChefHat size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No recipes found</h3>
              <p className="text-muted-foreground mb-4">
                {searchMode === 'ingredients'
                  ? 'Try adding different ingredients or removing some to get more results'
                  : 'Try adjusting your search terms or filters'
                }
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => {
                  clearAll();
                  loadTrendingRecipes();
                }}>
                  Show Trending Recipes
                </Button>
                {searchMode === 'ingredients' && ingredients.length > 0 && (
                  <Button variant="outline" onClick={() => setIngredients([])}>
                    Clear Ingredients
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recipe Detail Modal */}
        {selectedRecipe && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <CardHeader className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setSelectedRecipe(null)}
                >
                  <X size={20} />
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={selectedRecipe.image}
                      alt={selectedRecipe.title}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <CardTitle className="text-2xl mb-4">{selectedRecipe.title}</CardTitle>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{selectedRecipe.readyInMinutes} minutes</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} />
                        <span>{selectedRecipe.servings} servings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart size={16} />
                        <span>Health Score: {selectedRecipe.healthScore || 75}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span>{formatPrice(selectedRecipe.pricePerServing || 200)}/serving</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="mb-6">
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground"
                     dangerouslySetInnerHTML={{
                       __html: selectedRecipe.summary || 'A delicious recipe you\'ll love!'
                     }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Cuisines & Diets</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecipe.cuisines?.map((cuisine, index) => (
                        <Badge key={index} variant="secondary">
                          {cuisine}
                        </Badge>
                      ))}
                      {selectedRecipe.diets?.map((diet, index) => (
                        <Badge key={index} className="bg-green-100 text-green-800">
                          <Leaf size={12} className="mr-1" />
                          {diet}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Dish Types</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRecipe.dishTypes?.map((type, index) => (
                        <Badge key={index} variant="outline">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* API Status */}
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={API_KEY && API_KEY !== 'demo_key' ? "bg-green-100 text-green-800" : "bg-primary/20 text-primary"}>
                {API_KEY && API_KEY !== 'demo_key' ? 'Live API' : 'Demo Mode'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {API_KEY && API_KEY !== 'demo_key'
                  ? 'Connected to Spoonacular API - showing real recipe data!'
                  : 'Using demo data. Add your Spoonacular API key to .env file for live recipe data.'
                }
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </ProjectLayout>
  );
};

export default RecipeFinder;
