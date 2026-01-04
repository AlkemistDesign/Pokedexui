import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from './ui/select';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, Filter } from 'lucide-react';
import { REGIONS, TYPES, HABITATS } from '../utils/pokemonConstants';

interface PokemonFiltersProps {
  selectedRegion: string;
  onRegionChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedHabitat: string;
  onHabitatChange: (value: string) => void;
  isLegendary: boolean;
  onLegendaryChange: (value: boolean) => void;
  onClear: () => void;
}

export const PokemonFilters: React.FC<PokemonFiltersProps> = ({
  selectedRegion,
  onRegionChange,
  selectedType,
  onTypeChange,
  selectedHabitat,
  onHabitatChange,
  isLegendary,
  onLegendaryChange,
  onClear
}) => {
  const hasActiveFilters = selectedRegion || selectedType || selectedHabitat || isLegendary;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
      <div className="flex items-center gap-1 text-slate-500 mt-[0px] mr-[0px] mb-[0px] ml-[2px]">
        <Filter size={14} />
      </div>

      {/* Region / Generation Filter */}
      <Select value={selectedRegion} onValueChange={onRegionChange}>
        <SelectTrigger className="w-[130px] h-8 text-xs bg-slate-50">
          <SelectValue placeholder="Gen / Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Regions</SelectItem>
          {REGIONS.map((region) => (
            <SelectItem key={region.key} value={region.key}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Type Filter */}
      <Select value={selectedType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-[110px] h-8 text-xs bg-slate-50 capitalize">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          {TYPES.map((type) => (
            <SelectItem key={type} value={type} className="capitalize">
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Habitat Filter */}
      <Select value={selectedHabitat} onValueChange={onHabitatChange}>
        <SelectTrigger className="w-[110px] h-8 text-xs bg-slate-50 capitalize">
          <SelectValue placeholder="Habitat" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Habitats</SelectItem>
          {HABITATS.map((habitat) => (
            <SelectItem key={habitat} value={habitat} className="capitalize">
              {habitat}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Legendary Toggle */}
      <Button 
        variant={isLegendary ? "default" : "outline"}
        size="sm"
        onClick={() => onLegendaryChange(!isLegendary)}
        className={`h-8 text-xs px-3 ${isLegendary ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600' : 'text-slate-600'}`}
      >
        Legendary
      </Button>

      {/* Clear Button */}
      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClear}
          className="h-6 w-6 p-0 text-slate-400 hover:text-red-500 ml-auto"
        >
          <X size={16} />
        </Button>
      )}
    </div>
  );
};
