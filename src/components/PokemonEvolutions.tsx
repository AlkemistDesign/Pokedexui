import React, { useEffect, useState } from 'react';
import { PokemonDetail } from '../hooks/usePokemon';

interface PokemonEvolutionsProps {
  pokemon?: PokemonDetail | null;
  onSelect?: (name: string) => void;
}

interface EvoNode {
  name: string;
  id: number;
}

export const PokemonEvolutions: React.FC<PokemonEvolutionsProps> = ({ pokemon, onSelect }) => {
  const [evolutions, setEvolutions] = useState<{ prev: EvoNode[]; next: EvoNode[] }>({ prev: [], next: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!pokemon) {
      setEvolutions({ prev: [], next: [] });
      return;
    }

    const fetchEvolutions = async () => {
      setLoading(true);
      try {
        const speciesUrl = (pokemon as any).species?.url;
        if (!speciesUrl) return;

        const speciesRes = await fetch(speciesUrl);
        const speciesData = await speciesRes.json();
        
        const evoChainUrl = speciesData.evolution_chain?.url;
        if (!evoChainUrl) return;

        const evoRes = await fetch(evoChainUrl);
        const evoData = await evoRes.json();

        // Helper to extract ID
        const getId = (url: string) => {
             const parts = url.split('/').filter(Boolean);
             return parseInt(parts[parts.length - 1]);
        };

        // Recursive search to find current pokemon and split chain
        const findInChain = (node: any, path: EvoNode[]): { found: boolean, prev: EvoNode[], next: EvoNode[] } | null => {
            const nodeId = getId(node.species.url);
            const currentNode: EvoNode = { name: node.species.name, id: nodeId };
            
            // Match found?
            // We match by name or ID. Name is safer for species.
            if (node.species.name === speciesData.name) {
                // Collect all descendants
                const descendants: EvoNode[] = [];
                const collectDescendants = (n: any) => {
                    if (n.evolves_to) {
                        n.evolves_to.forEach((child: any) => {
                            descendants.push({ name: child.species.name, id: getId(child.species.url) });
                            collectDescendants(child);
                        });
                    }
                };
                collectDescendants(node);
                
                return { found: true, prev: [...path], next: descendants };
            }

            // Continue search
            if (node.evolves_to) {
                for (const child of node.evolves_to) {
                    const result = findInChain(child, [...path, currentNode]);
                    if (result?.found) return result;
                }
            }
            
            return null;
        };

        const result = findInChain(evoData.chain, []);
        
        if (result) {
            setEvolutions({ prev: result.prev, next: result.next });
        } else {
            setEvolutions({ prev: [], next: [] });
        }

      } catch (err) {
        console.error('Failed to fetch evolutions', err);
        setEvolutions({ prev: [], next: [] });
      } finally {
        setLoading(false);
      }
    };

    fetchEvolutions();
  }, [pokemon?.id, pokemon?.name]);

  const Slot = ({ node }: { node: EvoNode }) => {
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${node.id}.png`;

    return (
      <div 
        onClick={() => onSelect?.(node.name)}
        className="w-10 h-12 bg-white border border-slate-400 rounded shadow-sm flex flex-col items-center justify-between overflow-hidden p-0.5 cursor-pointer hover:bg-blue-50 hover:border-blue-400 transition-colors active:scale-95"
      >
          {loading ? (
             <span className="text-[7px] font-mono mx-auto">...</span>
          ) : (
             <>
                <img 
                  src={spriteUrl} 
                  alt={node.name} 
                  className="w-8 h-8 object-contain pixelated" 
                  style={{imageRendering: 'pixelated'}}
                />
                <span className="text-[6px] font-mono leading-none text-slate-800 uppercase truncate w-full text-center">
                    {node.name}
                </span>
             </>
          )}
      </div>
    );
  };

  return (
    <div className="flex gap-1 overflow-x-auto pb-1 max-w-full">
       {evolutions.prev.map(node => <Slot key={node.id} node={node} />)}
       
       {evolutions.next.map(node => <Slot key={node.id} node={node} />)}
    </div>
  );
};
