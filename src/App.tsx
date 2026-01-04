import { useState, useEffect, useMemo } from 'react';
import { PokedexShell } from './components/PokedexShell';
import { PokemonList } from './components/PokemonList';
import { PokemonDetail } from './components/PokemonDetail';
import { PokemonFilters } from './components/PokemonFilters';
import { usePokemon, PokemonSummary, PokemonDetail as PokemonDetailType } from './hooks/usePokemon';
import { Search } from 'lucide-react';
import { Input } from './components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { REGIONS, isLegendary } from './utils/pokemonConstants';

export default function App() {
  const { fetchAllPokemon, getPokemon, getNamesByType, getNamesByHabitat, loading, error } = usePokemon();
  
  // Data State
  const [allPokemon, setAllPokemon] = useState<PokemonSummary[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetailType | null>(null);
  
  // View State
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Pagination & Search State
  const [limit, setLimit] = useState(24);
  const [searchQuery, setSearchQuery] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);

  // Filter State
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedHabitat, setSelectedHabitat] = useState('all');
  const [isLegendaryFilter, setIsLegendaryFilter] = useState(false);
  const [sortOrder, setSortOrder] = useState<'id' | 'name'>('id');

  // Filter Data Cache
  const [typeSet, setTypeSet] = useState<Set<string> | null>(null);
  const [habitatSet, setHabitatSet] = useState<Set<string> | null>(null);
  const [isFilteringData, setIsFilteringData] = useState(false);

  // Initial Load
  useEffect(() => {
    const loadAll = async () => {
      setIsInitializing(true);
      const list = await fetchAllPokemon();
      setAllPokemon(list);
      setIsInitializing(false);
    };
    loadAll();
  }, []);

  // Fetch Type Data
  useEffect(() => {
    if (selectedType === 'all') {
      setTypeSet(null);
      return;
    }
    const loadType = async () => {
      setIsFilteringData(true);
      const names = await getNamesByType(selectedType);
      setTypeSet(new Set(names));
      setIsFilteringData(false);
    };
    loadType();
  }, [selectedType]);

  // Fetch Habitat Data
  useEffect(() => {
    if (selectedHabitat === 'all') {
      setHabitatSet(null);
      return;
    }
    const loadHabitat = async () => {
      setIsFilteringData(true);
      const names = await getNamesByHabitat(selectedHabitat);
      setHabitatSet(new Set(names));
      setIsFilteringData(false);
    };
    loadHabitat();
  }, [selectedHabitat]);

  // Filter List Logic
  const filteredPokemon = useMemo(() => {
    let result = allPokemon;

    // 1. Search Query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) || 
        String(p.id) === query
      );
    }

    // 2. Region / Generation (ID Range)
    if (selectedRegion && selectedRegion !== 'all') {
      const region = REGIONS.find(r => r.key === selectedRegion);
      if (region) {
        result = result.filter(p => p.id >= region.idRange[0] && p.id <= region.idRange[1]);
      }
    }

    // 3. Type (Intersection with fetched set)
    if (selectedType !== 'all' && typeSet) {
      result = result.filter(p => typeSet.has(p.name));
    }

    // 4. Habitat (Intersection with fetched set)
    if (selectedHabitat !== 'all' && habitatSet) {
      result = result.filter(p => habitatSet.has(p.name));
    }

    // 5. Legendary Status (ID Check)
    if (isLegendaryFilter) {
      result = result.filter(p => isLegendary(p.id));
    }

    // Sort Result
    return [...result].sort((a, b) => {
      if (sortOrder === 'name') {
        return a.name.localeCompare(b.name);
      }
      return a.id - b.id;
    });
  }, [allPokemon, searchQuery, selectedRegion, selectedType, typeSet, selectedHabitat, habitatSet, isLegendaryFilter, sortOrder]);

  // Paginate List
  const displayedPokemon = useMemo(() => {
    return filteredPokemon.slice(0, limit);
  }, [filteredPokemon, limit]);

  const hasMore = displayedPokemon.length < filteredPokemon.length;

  const handleLoadMore = () => {
    setLimit(prev => prev + 24);
  };

  const handleSelectPokemon = async (summary: PokemonSummary) => {
    const details = await getPokemon(summary.id);
    if (details) {
      setSelectedPokemon(details);
      setIsDetailOpen(true);
    }
  };

  const handleEvolutionSelect = async (name: string) => {
    const details = await getPokemon(name);
    if (details) {
      setSelectedPokemon(details);
      // setIsDetailOpen(true); // Already open
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setLimit(24); 
  };

  const handleBack = () => {
    setIsDetailOpen(false);
    setSelectedPokemon(null); 
  };

  const handleClearFilters = () => {
    setSelectedRegion('all');
    setSelectedType('all');
    setSelectedHabitat('all');
    setIsLegendaryFilter(false);
    setSearchQuery('');
  };

  const currentIndex = useMemo(() => {
    if (!selectedPokemon) return -1;
    return filteredPokemon.findIndex(p => p.id === selectedPokemon.id);
  }, [selectedPokemon, filteredPokemon]);

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < filteredPokemon.length - 1) {
      handleSelectPokemon(filteredPokemon[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      handleSelectPokemon(filteredPokemon[currentIndex - 1]);
    }
  };

  const isLoading = isInitializing || loading || isFilteringData;

  return (
    <PokedexShell 
      isRightPanelVisible={isDetailOpen}
      pokemon={selectedPokemon}
      onPokemonSelect={handleEvolutionSelect}
      rightPanelContent={
        selectedPokemon ? (
           <PokemonDetail 
             pokemon={selectedPokemon} 
             onBack={handleBack}
             onNext={handleNext}
             onPrevious={handlePrevious}
             canNext={currentIndex >= 0 && currentIndex < filteredPokemon.length - 1}
             canPrevious={currentIndex > 0} 
           />
        ) : null
      }
    >
      {/* Left Panel Content (List & Search) */}
      <div className="flex flex-col h-full bg-slate-100">
        <div className="sticky top-0 z-20 bg-slate-100 border-b border-slate-200 shadow-sm flex flex-col gap-2 p-3">
           {/* Top Row: Search */}
           <div className="relative w-full">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
             <Input 
               placeholder="Search Pokemon..." 
               className="pl-10 bg-white border-slate-300 focus-visible:ring-blue-500"
               value={searchQuery}
               onChange={handleSearchChange}
             />
           </div>
           
           {/* Bottom Row: Filters */}
           <PokemonFilters 
             selectedRegion={selectedRegion}
             onRegionChange={setSelectedRegion}
             selectedType={selectedType}
             onTypeChange={setSelectedType}
             selectedHabitat={selectedHabitat}
             onHabitatChange={setSelectedHabitat}
             isLegendary={isLegendaryFilter}
             onLegendaryChange={setIsLegendaryFilter}
             onClear={handleClearFilters}
           />

           <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <Select value={sortOrder} onValueChange={(val: any) => setSortOrder(val)}>
                  <SelectTrigger className="h-6 w-[60px] text-[10px] border-none bg-transparent shadow-none p-0 text-slate-400 hover:text-slate-600 focus:ring-0">
                    <div className="flex items-center gap-1">
                      <span className="font-normal normal-case">Sort:</span>
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">ID</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <span>
                 {filteredPokemon.length} matches
              </span>
           </div>
        </div>

        <div className="flex-1 overflow-auto">
          <PokemonList 
            pokemons={displayedPokemon} 
            onSelect={handleSelectPokemon} 
            loading={isLoading} 
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
          />
        </div>
      </div>
    </PokedexShell>
  );
}
