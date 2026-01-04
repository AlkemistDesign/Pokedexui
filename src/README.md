# Retro Pokedex

A fully interactive, retro-styled Pokedex application built with React and Tailwind CSS. This project features live data from the PokeAPI.

## Features

- **3D Cover Animation**: A custom double-panel opening experience with a 360-degree rotating cover powered by Motion.
- **Live Search & Filtering**: Filter Pokemon by Name, ID, Region (Generation), Type, Habitat, and Legendary status.
- **Detailed Views**: View stats, types, and official artwork.
- **Evolution Chains**: Visualizes the complete evolution family tree, including branching evolutions, using recursive logic.
- **Responsive Design**: Optimized for both desktop (dual panel) and mobile (stacked/modal) experiences.

## Tech Stack

- **Framework**: React (TypeScript)
- **Styling**: Tailwind CSS
- **Animation**: Motion (fka Framer Motion)
- **Icons**: Lucide React
- **Data**: PokeAPI
- **Build Tool**: Vite

## Getting Started

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `/components`: UI components and core application logic (`PokedexShell`, `PokemonList`, `PokemonDetail`).
- `/hooks`: Custom hooks, primarily `usePokemon.ts` for handling API requests and caching.
- `/utils`: Constants for Regions, Types, Habitats, and helper functions.
- `/styles`: Global Tailwind configuration.

## License

This project is open source and available under the MIT License.
Pokémon and Pokémon character names are trademarks of Nintendo.