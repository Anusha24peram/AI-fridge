
import React, { useState, useEffect } from 'react';
import { AppView, Ingredient, Recipe, DietaryRestriction, Review } from './types';
import Sidebar from './components/Sidebar';
import FridgeScanner from './components/FridgeScanner';
import RecipeGrid from './components/RecipeGrid';
import CookingMode from './components/CookingMode';
import ShoppingList from './components/ShoppingList';
import PantryManager from './components/PantryManager';
import ReviewModal from './components/ReviewModal';
import { analyzeFridgeImage, getRecipeSuggestions, generateRecipeImage } from './services/gemini';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('SCANNER');
  const [fridgeIngredients, setFridgeIngredients] = useState<Ingredient[]>([]);
  const [pantryItems, setPantryItems] = useState<Ingredient[]>(() => {
    const saved = localStorage.getItem('chefvision_pantry');
    return saved ? JSON.parse(saved) : [];
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [recipeImages, setRecipeImages] = useState<Record<string, string>>({});
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [dietaryRestriction, setDietaryRestriction] = useState<DietaryRestriction>(DietaryRestriction.NONE);
  const [isScanning, setIsScanning] = useState(false);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [showReviewModal, setShowReviewModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('chefvision_pantry', JSON.stringify(pantryItems));
  }, [pantryItems]);

  const urgentPantryItems = pantryItems.filter(item => {
    if (!item.expiryDate) return false;
    const diff = new Date(item.expiryDate).getTime() - Date.now();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days <= 3;
  });

  const handleImageCaptured = async (base64: string) => {
    setIsScanning(true);
    const detected = await analyzeFridgeImage(base64);
    const mapped = detected.map((name, idx) => ({ id: `${Date.now()}-${idx}`, name }));
    setFridgeIngredients(mapped);
    setIsScanning(false);
    
    if (mapped.length > 0) {
      await refreshRecipes(detected);
    }
  };

  const refreshRecipes = async (fridgeNames: string[]) => {
    setIsScanning(true);
    const suggested = await getRecipeSuggestions(fridgeNames, pantryItems, dietaryRestriction);
    setRecipes(suggested);
    setIsScanning(false);
    setView('RECIPES');

    // Trigger background image generation
    suggested.forEach(async (recipe) => {
      const imageUrl = await generateRecipeImage(recipe.imageDescription);
      if (imageUrl) {
        setRecipeImages(prev => ({ ...prev, [recipe.id]: imageUrl }));
      }
    });
  };

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setView('COOKING');
  };

  const addToShoppingList = (itemName: string) => {
    setShoppingList(prev => [...new Set([...prev, itemName])]);
  };

  const removeFromShoppingList = (itemName: string) => {
    setShoppingList(prev => prev.filter(i => i !== itemName));
  };

  const handleFinishCooking = () => {
    setShowReviewModal(true);
  };

  const handleSubmitReview = (review: Partial<Review>) => {
    if (selectedRecipe) {
      const newReview: Review = {
        userName: 'You',
        rating: review.rating || 5,
        comment: review.comment || '',
        date: new Date().toLocaleDateString()
      };
      
      setRecipes(prev => prev.map(r => {
        if (r.id === selectedRecipe.id) {
          const totalRating = (r.rating * r.reviewCount) + newReview.rating;
          const newCount = r.reviewCount + 1;
          return {
            ...r,
            reviewCount: newCount,
            rating: totalRating / newCount,
            recentReviews: [newReview, ...r.recentReviews].slice(0, 3)
          };
        }
        return r;
      }));
    }
    setShowReviewModal(false);
    setView('RECIPES');
    setSelectedRecipe(null);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-slate-50 text-slate-800">
      <Sidebar 
        view={view} 
        setView={setView} 
        restriction={dietaryRestriction} 
        setRestriction={setDietaryRestriction}
        shoppingCount={shoppingList.length}
      />
      
      <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8 overflow-y-auto overflow-x-hidden">
        {view === 'SCANNER' && (
          <FridgeScanner 
            onCapture={handleImageCaptured} 
            isScanning={isScanning} 
            ingredients={fridgeIngredients}
            urgentItems={urgentPantryItems}
            onRetry={() => setFridgeIngredients([])}
            onFindRecipes={() => refreshRecipes(fridgeIngredients.map(i => i.name))}
          />
        )}

        {view === 'RECIPES' && (
          <RecipeGrid 
            recipes={recipes} 
            recipeImages={recipeImages}
            onSelect={handleSelectRecipe} 
            isLoading={isScanning} 
            onAddToShopping={addToShoppingList}
          />
        )}

        {view === 'COOKING' && selectedRecipe && (
          <CookingMode 
            recipe={selectedRecipe} 
            onClose={() => setView('RECIPES')} 
            onFinish={handleFinishCooking}
          />
        )}

        {view === 'SHOPPING' && (
          <ShoppingList 
            items={shoppingList} 
            onRemove={removeFromShoppingList} 
          />
        )}

        {view === 'PANTRY' && (
          <PantryManager 
            items={pantryItems} 
            setItems={setPantryItems} 
          />
        )}
      </main>

      {showReviewModal && (
        <ReviewModal 
          onSubmit={handleSubmitReview} 
          onCancel={() => {
            setShowReviewModal(false);
            setView('RECIPES');
          }}
        />
      )}
    </div>
  );
};

export default App;
