
import React from 'react';
import { Recipe } from '../types';

interface RecipeGridProps {
  recipes: Recipe[];
  recipeImages: Record<string, string>;
  onSelect: (r: Recipe) => void;
  isLoading: boolean;
  onAddToShopping: (item: string) => void;
}

const RecipeGrid: React.FC<RecipeGridProps> = ({ recipes, recipeImages, onSelect, isLoading, onAddToShopping }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <p className="text-slate-500 font-medium">Curating recipes for your ingredients...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-16 md:pt-0">
      <div className="mb-8 px-4 md:px-0">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Culinary Inspiration</h2>
        <p className="text-slate-500">Based on your fridge contents, pantry, and dietary preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 px-4 md:px-0">
        {recipes.map((recipe) => {
          const imageUrl = recipeImages[recipe.id];
          
          return (
            <div 
              key={recipe.id} 
              className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-xl transition-all flex flex-col h-full cursor-pointer"
              onClick={() => onSelect(recipe)}
            >
              <div className="relative h-48 bg-slate-100 flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                  <img 
                    src={imageUrl} 
                    alt={recipe.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 animate-in fade-in"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 animate-pulse flex flex-col items-center justify-center text-slate-400">
                    <svg className="w-10 h-10 mb-2 opacity-20" fill="currentColor" viewBox="0 0 24 24"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Generating Photo...</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 glass rounded-full text-xs font-bold text-slate-900 shadow-sm">
                    {recipe.difficulty}
                  </span>
                  <span className="px-3 py-1 glass rounded-full text-xs font-bold text-slate-900 shadow-sm">
                    {recipe.prepTime}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="px-3 py-1 glass rounded-full flex items-center gap-1 shadow-sm">
                    <span className="text-amber-500 text-sm">★</span>
                    <span className="text-xs font-bold text-slate-900">{recipe.rating.toFixed(1)}</span>
                    <span className="text-[10px] text-slate-500 ml-1">({recipe.reviewCount})</span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {recipe.name}
                  </h3>
                  <span className="text-sm font-semibold text-slate-400">
                    {recipe.calories} kcal
                  </span>
                </div>
                
                <p className="text-sm text-slate-500 line-clamp-2 mb-4">
                  {recipe.description}
                </p>

                <div className="mt-auto space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">What you'll need</h4>
                    <div className="flex flex-wrap gap-2">
                      {recipe.ingredients.slice(0, 6).map((ing, idx) => (
                        <div 
                          key={idx} 
                          className={`text-[10px] px-2 py-1 rounded-md border flex items-center gap-1.5 transition-colors ${ing.isMissing ? 'bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 border-emerald-100 text-emerald-600'}`}
                          onClick={(e) => {
                            if (ing.isMissing) {
                              e.stopPropagation();
                              onAddToShopping(ing.name);
                            }
                          }}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${ing.isMissing ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          {ing.name}
                          {ing.isMissing && (
                            <span className="ml-1 font-bold">+</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl group-hover:bg-indigo-600 transition-colors shadow-lg shadow-slate-900/10">
                    Cook this meal
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecipeGrid;
