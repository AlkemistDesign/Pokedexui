import React from 'react';
import { PokemonDetail as PokemonDetailType } from '../hooks/usePokemon';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Badge } from './ui/badge';

interface PokemonDetailProps {
  pokemon: PokemonDetailType;
  onBack: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  canNext?: boolean;
  canPrevious?: boolean;
}

const typeColors: Record<string, string> = {
  normal: 'bg-neutral-400',
  fire: 'bg-orange-500',
  water: 'bg-blue-500',
  electric: 'bg-yellow-400',
  grass: 'bg-green-500',
  ice: 'bg-cyan-300',
  fighting: 'bg-red-700',
  poison: 'bg-purple-500',
  ground: 'bg-amber-600',
  flying: 'bg-indigo-300',
  psychic: 'bg-pink-500',
  bug: 'bg-lime-500',
  rock: 'bg-stone-500',
  ghost: 'bg-purple-800',
  dragon: 'bg-violet-600',
  steel: 'bg-slate-400',
  fairy: 'bg-pink-300',
};

export const PokemonDetail: React.FC<PokemonDetailProps> = ({ 
  pokemon, 
  onBack,
  onNext,
  onPrevious,
  canNext = false,
  canPrevious = false
}) => {
  // Get official artwork or fallback to default sprite
  const image = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
  const [imgError, setImgError] = React.useState(false);
  
  // Reset error state when pokemon changes
  React.useEffect(() => {
    setImgError(false);
  }, [pokemon.id]);

  const fallback = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png`;
  const displayImage = imgError || !image ? fallback : image;

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-slate-100 border-b flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-slate-200 rounded-full transition-colors"
        >
          <ArrowLeft className="text-slate-600" />
        </button>
        <div>
          <h2 className="text-2xl font-bold capitalize text-slate-800 leading-none">{pokemon.name}</h2>
          <span className="text-slate-500 font-mono text-sm">#{String(pokemon.id).padStart(4, '0')}</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden p-6 flex flex-col min-h-0">
        {/* Main Image */}
        <div className="flex-1 flex items-center justify-center relative min-h-0 mb-4 group/image">
           {canPrevious && (
             <button 
               onClick={(e) => { e.stopPropagation(); onPrevious?.(); }}
               className="absolute bottom-[5vh] md:bottom-30 left-0 z-20 p-2 rounded-full bg-slate-100/50 hover:bg-slate-100 text-slate-700 transition-all opacity-100 group-hover/image:opacity-100 focus:opacity-100 bg-[rgb(255,255,255)]"
               aria-label="Previous Pokemon"
             >
               <ChevronLeft size={24} />
             </button>
           )}
           
           <img 
             src={displayImage} 
             alt={pokemon.name} 
             className={`w-full h-full object-contain relative z-10 drop-shadow-xl animate-in fade-in zoom-in duration-500 ${imgError ? 'opacity-20 scale-50' : ''}`}
             onError={() => setImgError(true)}
           />

           {canNext && (
             <button 
               onClick={(e) => { e.stopPropagation(); onNext?.(); }}
               className="absolute bottom-[5vh] md:bottom-30 right-0 z-20 p-2 rounded-full bg-slate-100/50 hover:bg-slate-100 text-slate-700 transition-all opacity-100 group-hover/image:opacity-100 focus:opacity-100 bg-[rgb(255,255,255)]"
               aria-label="Next Pokemon"
             >
               <ChevronRight size={24} />
             </button>
           )}
        </div>

        {/* Types */}
        <div className="flex justify-center gap-2 mb-4 shrink-0">
          {pokemon.types.map((t) => (
            <Badge 
              key={t.type.name} 
              className={`${typeColors[t.type.name] || 'bg-slate-500'} text-white border-none px-4 py-1 text-base capitalize hover:opacity-90`}
            >
              {t.type.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};
