export const REGIONS = [
  { name: 'Kanto', key: 'kanto', idRange: [1, 151] },
  { name: 'Johto', key: 'original-johto', idRange: [152, 251] },
  { name: 'Hoenn', key: 'hoenn', idRange: [252, 386] },
  { name: 'Sinnoh', key: 'original-sinnoh', idRange: [387, 493] },
  { name: 'Unova', key: 'original-unova', idRange: [494, 649] },
  { name: 'Kalos', key: 'kalos-central', idRange: [650, 721] },
  { name: 'Alola', key: 'original-alola', idRange: [722, 809] },
  { name: 'Galar', key: 'galar', idRange: [810, 905] },
  { name: 'Paldea', key: 'paldea', idRange: [906, 1025] }
];

export const TYPES = [
  'normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 
  'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 
  'dragon', 'steel', 'dark', 'fairy', 'stellar'
];

export const HABITATS = [
  'cave', 'forest', 'grassland', 'mountain', 'rare', 
  'rough-terrain', 'sea', 'urban', 'waters-edge'
];

// Major Legendary/Mythical IDs (Approximate list for filtering)
export const LEGENDARY_IDS = new Set([
  // Gen 1
  144, 145, 146, 150, 151,
  // Gen 2
  243, 244, 245, 249, 250, 251,
  // Gen 3
  377, 378, 379, 380, 381, 382, 383, 384, 385, 386,
  // Gen 4
  480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494,
  // Gen 5
  638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649,
  // Gen 6
  716, 717, 718, 719, 720, 721,
  // Gen 7
  772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801, 802, 803, 804, 805, 806, 807, 808, 809,
  // Gen 8
  888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 905,
  // Gen 9
  1001, 1002, 1003, 1004, 1005, 1006, 1007, 1008, 1009, 1010, 1014, 1015, 1016, 1017, 1024, 1025
]);

export function isLegendary(id: number): boolean {
  return LEGENDARY_IDS.has(id);
}
