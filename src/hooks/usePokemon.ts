import { useState, useEffect } from 'react';

const POKE_API_BASE = 'https://pokeapi.co/api/v2';

export interface PokemonSummary {
  name: string;
  url: string;
  id: number;
}

export interface PokemonDetail {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
      home: {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
  height: number;
  weight: number;
  abilities: Array<{
    ability: {
      name: string;
    };
  }>;
}

export const usePokemon = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPokemonList = async (limit = 20, offset = 0): Promise<PokemonSummary[]> => {
    try {
      const response = await fetch(`${POKE_API_BASE}/pokemon?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      
      // Extract ID from URL to avoid extra fetches for lists
      return data.results.map((p: any) => {
        const id = parseInt(p.url.split('/').filter(Boolean).pop() || '0');
        return { ...p, id };
      });
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const fetchAllPokemon = async (): Promise<PokemonSummary[]> => {
    // 2000 is enough to cover all current pokemon forms
    return fetchPokemonList(2000, 0);
  };

  const getPokemon = async (nameOrId: string | number): Promise<PokemonDetail | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${POKE_API_BASE}/pokemon/${nameOrId.toString().toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokemon not found');
      }
      const data = await response.json();
      return data as PokemonDetail;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getNamesByType = async (type: string): Promise<string[]> => {
    try {
      const response = await fetch(`${POKE_API_BASE}/type/${type}`);
      const data = await response.json();
      return data.pokemon.map((p: any) => p.pokemon.name);
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  const getNamesByHabitat = async (habitat: string): Promise<string[]> => {
    try {
      const response = await fetch(`${POKE_API_BASE}/pokemon-habitat/${habitat}`);
      const data = await response.json();
      return data.pokemon_species.map((p: any) => p.name);
    } catch (err) {
      console.error(err);
      return [];
    }
  };

  return { fetchPokemonList, fetchAllPokemon, getPokemon, getNamesByType, getNamesByHabitat, loading, error };
};
