import React from 'react';
import { PokemonSummary } from '../hooks/usePokemon';

interface PokemonListProps {
  pokemons: PokemonSummary[];
  onSelect: (pokemon: PokemonSummary) => void;
  loading: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

const PokemonSprite = ({ id, name }: { id: number; name: string }) => {
  const [error, setError] = React.useState(false);
  const src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
  const fallback = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png`;

  return (
    <div className="relative w-20 h-20 bg-slate-100 rounded-full mb-2 group-hover:scale-110 transition-transform flex items-center justify-center">
      <img
        src={error ? fallback : src}
        alt={name}
        className={`w-full h-full object-contain pixelated ${error ? 'opacity-20 scale-50' : ''}`}
        loading="lazy"
        onError={() => setError(true)}
      />
    </div>
  );
};

export const PokemonList: React.FC<PokemonListProps> = ({ pokemons, onSelect, loading, onLoadMore, hasMore }) => {
  return (
    <div className="p-4">
      {pokemons.length === 0 && !loading && (
        <div className="text-center py-10 text-slate-500">
          <p className="text-lg font-bold mb-2">No Pokemon Found</p>
          <p className="text-sm">Try searching for a different name or ID.</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {pokemons.map((p) => (
          <button
            key={p.id}
            onClick={() => onSelect(p)}
            className="group flex flex-col items-center bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all hover:bg-blue-50 border border-slate-200 hover:border-blue-300 cursor-pointer"
          >
            <PokemonSprite id={p.id} name={p.name} />
            <span className="text-xs font-mono text-slate-500">#{String(p.id).padStart(3, '0')}</span>
            <span className="text-sm font-bold capitalize text-slate-700">{p.name}</span>
          </button>
        ))}
      </div>
      
      {loading && (
        <div className="flex justify-center p-4 py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      )}
      
      {!loading && hasMore && (
        <div className="mt-6 flex justify-center pb-4">
          <button 
            onClick={onLoadMore}
            className="px-6 py-2 bg-slate-800 text-white rounded-full font-bold hover:bg-slate-700 transition-colors shadow-lg active:scale-95"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};
