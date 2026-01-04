import React, { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PokemonDetail as PokemonDetailType } from "../hooks/usePokemon";
import { PokemonEvolutions } from "./PokemonEvolutions";
import {
  Heart,
  Sword,
  Shield,
  Zap,
  Sparkles,
  Weight,
  Ruler,
} from "lucide-react";

interface PokedexShellProps {
  children: React.ReactNode; // Left Panel Content
  rightPanelContent?: React.ReactNode; // Right Panel Content
  isRightPanelVisible?: boolean; // Controls mobile visibility (if true, shows right panel instead of left)
  pokemon?: PokemonDetailType | null;
  onPokemonSelect?: (name: string) => void;
}

export const PokedexShell: React.FC<PokedexShellProps> = ({
  children,
  rightPanelContent,
  isRightPanelVisible = false,
  pokemon,
  onPokemonSelect,
}) => {
  const [isXL, setIsXL] = useState(false);
  const [isCoverOpen, setIsCoverOpen] = useState(false);

  useEffect(() => {
    const checkSize = () => setIsXL(window.innerWidth >= 1280);
    checkSize(); // Initial check
    window.addEventListener("resize", checkSize);
    return () =>
      window.removeEventListener("resize", checkSize);
  }, []);

  const statButtons = useMemo(() => {
    const blueBtn = {
      btnBg: "bg-blue-400",
      btnBorder: "border-blue-600",
      text: "text-blue-900",
    };
    const grayBtn = {
      btnBg: "bg-slate-500",
      btnBorder: "border-slate-700",
      text: "text-slate-900",
    };

    if (!pokemon) {
      // Return placeholders if no pokemon selected
      return [
        {
          icon: Heart,
          label: "HP",
          val: "--",
          color: "bg-red-500",
          ...blueBtn,
        },
        {
          icon: Sword,
          label: "ATK",
          val: "--",
          color: "bg-orange-500",
          ...blueBtn,
        },
        {
          icon: Shield,
          label: "DEF",
          val: "--",
          color: "bg-blue-500",
          ...blueBtn,
        },
        {
          icon: Weight,
          label: "WGT",
          val: "--",
          color: "bg-stone-500",
          ...grayBtn,
        },
        {
          icon: Zap,
          label: "SPD",
          val: "--",
          color: "bg-pink-500",
          ...blueBtn,
        },
        {
          icon: Sparkles,
          label: "SPA",
          val: "--",
          color: "bg-purple-500",
          ...blueBtn,
        },
        {
          icon: Shield,
          label: "SDF",
          val: "--",
          color: "bg-green-500",
          ...blueBtn,
        },
        {
          icon: Ruler,
          label: "HGT",
          val: "--",
          color: "bg-stone-500",
          ...grayBtn,
        },
      ];
    }

    const getStat = (name: string) =>
      pokemon.stats.find((s) => s.stat.name === name)
        ?.base_stat || 0;

    return [
      {
        icon: Heart,
        label: "HP",
        val: getStat("hp"),
        color: "bg-red-500",
        ...blueBtn,
      },
      {
        icon: Sword,
        label: "ATK",
        val: getStat("attack"),
        color: "bg-orange-500",
        ...blueBtn,
      },
      {
        icon: Shield,
        label: "DEF",
        val: getStat("defense"),
        color: "bg-blue-500",
        ...blueBtn,
      },
      {
        icon: Weight,
        label: "WGT",
        val: (pokemon.weight / 10).toFixed(1),
        color: "bg-stone-500",
        ...grayBtn,
      },
      {
        icon: Zap,
        label: "SPD",
        val: getStat("speed"),
        color: "bg-pink-500",
        ...blueBtn,
      },
      {
        icon: Sparkles,
        label: "SPA",
        val: getStat("special-attack"),
        color: "bg-purple-500",
        ...blueBtn,
      },
      {
        icon: Shield,
        label: "SDF",
        val: getStat("special-defense"),
        color: "bg-green-500",
        ...blueBtn,
      },
      {
        icon: Ruler,
        label: "HGT",
        val: (pokemon.height / 10).toFixed(1),
        color: "bg-stone-500",
        ...grayBtn,
      },
    ];
  }, [pokemon]);

  // Shared content for the cover
  const CoverBaseDecor = (
    <>
      {/* Beveled Edge */}
      <div className="absolute inset-0 border-8 border-red-700/30 rounded-bl-3xl pointer-events-none"></div>

      {/* Right Hinge Knuckles */}
      <div className="absolute right-0 top-10 w-4 h-12 bg-red-800 rounded-l-md border-l border-red-900 opacity-50"></div>
      <div className="absolute right-0 bottom-10 w-4 h-12 bg-red-800 rounded-l-md border-l border-red-900 opacity-50"></div>
    </>
  );

  const CoverFrontDecor = (
    <>
      {/* Front Content */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ backfaceVisibility: "hidden" }}
      >
        {/* Grooves */}
        <div className="absolute top-10 bottom-10 left-16 w-1 bg-red-800/20"></div>
        <div className="absolute top-10 bottom-10 left-20 w-1 bg-red-800/20"></div>
        {/* Yellow Triangle */}
        <div className="absolute top-center left-10 w-0 h-0 border-l-[25px] rotate-327 border-l-transparent border-r-[25px] border-r-transparent border-b-[40px] border-b-yellow-400 drop-shadow-lg"></div>

        {/* Center Content Group */}
        <div className="flex items-center gap-8 translate-x-4">
          {/* Button */}
          <button
            onClick={() => setIsCoverOpen(true)}
            className="relative bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xl py-4 px-8 rounded-lg border-b-8 border-blue-800 active:border-b-0 active:translate-y-2 shadow-[0_10px_0_rgba(0,0,0,0.2)] transition-all z-20 uppercase tracking-wider text-[15px] mt-[0px] mr-[0px] mb-[0px] ml-[60px]"
          >
            Catch them all!
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center md:px-[32px] px-[8px] py-[0px] overflow-hidden relative">
      <div
        className={`relative w-full flex flex-col xl:flex-row items-stretch transition-all duration-500 ease-in-out ${rightPanelContent ? "xl:max-w-7xl max-w-2xl" : "max-w-2xl"}`}
        style={{ perspective: "2000px" }}
      >
        {/* ================= LEFT PANEL ================= */}
        <div
          className={`
            relative w-full xl:w-[600px] bg-red-600 rounded-3xl xl:rounded-r-none xl:rounded-l-3xl shadow-2xl border-4 border-red-800 h-[calc(100vh-32px)] z-20 shrink-0
            ${isRightPanelVisible ? "hidden xl:block" : "block"}
        `}
        >
          {/* Inner Content Wrapper */}
          <div className="absolute inset-0 w-full h-full overflow-hidden rounded-[inherit] flex flex-col z-0">
            {/* Camera/Lights (Top) */}
            <div className="absolute top-[-6px] left-0 w-full h-32 p-6 flex items-start gap-4 z-10 pointer-events-none">
              {/* Big Blue Light */}
              <div className="w-16 h-16 rounded-full bg-blue-400 border-4 border-white shadow-[0_0_15px_rgba(59,130,246,0.6)] relative overflow-hidden">
                <div className="absolute top-2 left-2 w-4 h-4 bg-white rounded-full opacity-60"></div>
              </div>
              {/* Small Lights */}
              <div className="flex gap-2 mt-2">
                <div className="w-4 h-4 rounded-full bg-red-500 border border-red-800 shadow-inner"></div>
                <div className="w-4 h-4 rounded-full bg-yellow-400 border border-yellow-700 shadow-inner"></div>
                <div className="w-4 h-4 rounded-full bg-green-500 border border-green-800 shadow-inner"></div>
              </div>
            </div>

            {/* Decor Lines */}
            <div className="absolute top-15 right-4 w-50 h-26 z-99 text-[10px] text-red-800 font-mono font-bold text-right uppercase clip-path-slant">
              Pokémon and Pokémon character names are trademarks
              of Nintendo.
            </div>
            <div className="absolute top-0 left-0 w-full h-26 border-b-4 border-red-800 bg-red-600 z-0 clip-path-slant"></div>

            {/* Screen Container */}
            <div className="flex-1 flex flex-col p-6 pt-28 pb-8 gap-4 h-full z-10">
              <div className="flex-1 bg-slate-200 rounded-xl border-4 border-slate-400 shadow-inner overflow-hidden flex flex-col relative mt-[16px] mr-[0px] mb-[0px] ml-[0px]">
                {/* Screen Glare */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white to-transparent opacity-10 pointer-events-none rounded-tr-lg z-20"></div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-slate-100 text-slate-900 relative z-10">
                  {children}
                </div>

                {/* Screen Bottom Decor */}
                <div className="h-8 bg-slate-200 flex items-center justify-between px-4 border-t border-slate-300 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                  <div className="flex gap-1">
                    <div className="w-6 h-1 bg-slate-800 rounded-full"></div>
                    <div className="w-6 h-1 bg-slate-800 rounded-full"></div>
                    <div className="w-6 h-1 bg-slate-800 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= MIDDLE HINGE ================= */}
        <div className="hidden xl:flex flex-col w-12 bg-red-700 border-x-4 border-red-800 shadow-inner z-10 relative shrink-0 overflow-hidden">
          <div className="w-12 h-8 border-b-4 border-red-800 bg-red-600 mb-auto shrink-0"></div>
          <div className="w-12 h-full flex flex-col justify-around py-12 items-center opacity-50 shrink-0">
            <div className="w-12 h-1 bg-red-900"></div>
            <div className="w-12 h-1 bg-red-900"></div>
          </div>
          <div className="w-12 h-8 border-t-4 border-red-800 bg-red-600 mt-auto shrink-0"></div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <AnimatePresence mode="popLayout">
          {(rightPanelContent || isRightPanelVisible) && (
            <motion.div
              key="right-panel"
              initial={
                isXL
                  ? { rotateY: -100, opacity: 0 }
                  : { opacity: 1 }
              }
              animate={
                isXL
                  ? { rotateY: 0, opacity: 1 }
                  : { opacity: 1 }
              }
              exit={
                isXL
                  ? { rotateY: -90, opacity: 0 }
                  : { opacity: 1 }
              }
              transition={
                isXL
                  ? {
                      type: "spring",
                      stiffness: 60,
                      damping: 12,
                      mass: 0.8,
                    }
                  : { duration: 0 }
              }
              className={`
                    relative w-full xl:w-[600px] bg-red-600 rounded-3xl xl:rounded-l-none xl:rounded-r-3xl shadow-2xl overflow-hidden border-4 border-red-800 flex-col h-[calc(100vh-32px)] z-0 origin-left xl:origin-left shrink-0
                    ${isRightPanelVisible ? "flex" : "hidden"}
                    xl:flex
                `}
            >
              {/* Main Content Area (Screen) */}
              <div className="flex-1 p-6 w-full flex h-full flex-col gap-6">
                {/* The Black Screen Container */}
                <div className="bg-slate-900 rounded-xl border-4 border-slate-600 p-2 shadow-inner flex-1 flex flex-col min-h-0 h-full relative overflow-hidden">
                  {rightPanelContent ? (
                    <div className="bg-slate-800 w-full h-full rounded-lg overflow-hidden relative flex flex-col">
                      {rightPanelContent}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-green-500 font-mono text-sm animate-pulse">
                      WAITING FOR INPUT...
                    </div>
                  )}
                </div>

                {/* Blue Grid Buttons */}
                <div className="grid grid-cols-4 gap-2 p-[0px]">
                  {statButtons.map((stat, i) => (
                    <div
                      key={i}
                      className={`h-12 ${stat.btnBg} border-b-4 ${stat.btnBorder} rounded active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center leading-none p-1 overflow-hidden group`}
                    >
                      <div
                        className={`p-1 rounded-full text-white`}
                      >
                        <stat.icon size={18} />
                      </div>
                      <div className="flex md:items-center flex-col gap-1 mb-[4px] mt-[0px] mr-[0px] md:ml-[12px] ml-[4px]">
                        <span
                          className={`text-[10px] font-bold ${stat.text} mt-[10px] mr-[0px] mb-[0px] ml-[0px]`}
                        >
                          {stat.label}
                        </span>
                        <span className="text-xs font-mono text-white/90 group-hover:text-white transition-colors md:mx-[12px] my-[0px] font-bold">
                          {stat.val}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Decor Buttons */}
                <div className="flex flex-row flex-wrap md:flex-row items-center gap-4 justify-between">
                  <PokemonEvolutions
                    pokemon={pokemon}
                    onSelect={onPokemonSelect}
                  />
                  <div
                    onClick={() => {
                      // @ts-ignore
                      const cryUrl = (pokemon as any)?.cries
                        ?.latest;
                      if (cryUrl) {
                        const audio = new Audio(cryUrl);
                        audio.volume = 0.1;
                        audio
                          .play()
                          .catch((e) =>
                            console.error("Play error", e),
                          );
                      }
                    }}
                    className="w-10 h-10 rounded-full bg-yellow-400 border-b-4 border-yellow-600 shadow-lg cursor-pointer active:border-b-0 active:translate-y-1 transition-all"
                  ></div>
                  <div className="flex flex-col gap-1">
                    {[0, 1].map((index) => {
                      const ability =
                        pokemon?.abilities?.[index]?.ability
                          .name;
                      return (
                        <div
                          key={index}
                          className="md:w-40 w-30 h-8 bg-slate-900 rounded border border-slate-700"
                        >
                          <span
                            className={`text-[10px] font-mono mt-[10px] mr-[0px] mb-[0px] ml-[10px] text-[#56f38b] inline-block uppercase`}
                          >
                            {ability || "-"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Front Cover Animation (Double Panel Trick for Depth) */}
        <AnimatePresence>
          {!isCoverOpen && (
            <>
              {/* Front-Facing Panel (High Z-Index, Visible 0-50%) */}
              <motion.div
                key="front-cover-high"
                className="absolute top-26 bottom-0 z-50 bg-red-600 rounded-3xl rounded-tl-none rounded-r-none rounded-bl-3xl border-4 border-red-800 origin-right flex flex-col items-center justify-center overflow-hidden shadow-2xl left-[0px] right-[0px] md:left-[0px] md:right-[0px] xl:right-auto xl:w-[600px]"
                initial={{ rotateY: 0, x: 0, opacity: 1 }}
                exit={{
                  rotateY: 360,
                  x: isXL ? 48 : 0,
                  opacity: [1, 1, 0, 0],
                }}
                transition={{
                  rotateY: { duration: 2, ease: "easeInOut" },
                  x: { duration: 1, ease: "easeInOut" },
                  opacity: {
                    duration: 2,
                    times: [0, 0.5, 0.5, 1],
                  },
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {CoverBaseDecor}
                {CoverFrontDecor}
              </motion.div>

              {/* Back-Facing Panel (Low Z-Index, Visible 50-100%) */}
              <motion.div
                key="front-cover-low"
                className="absolute top-26 bottom-0 z-[-1] bg-red-600 rounded-3xl rounded-tl-none rounded-r-none rounded-bl-3xl border-4 border-red-800 origin-right flex flex-col items-center justify-center overflow-hidden shadow-2xl left-[0px] right-[0px] md:left-[0px] md:right-[0px] xl:right-auto xl:w-[600px]"
                initial={{ rotateY: 0, x: 0, opacity: 0 }}
                exit={{
                  rotateY: 360,
                  x: isXL ? 48 : 0,
                  opacity: [0, 0, 1, 1],
                }}
                transition={{
                  rotateY: { duration: 2, ease: "easeInOut" },
                  x: { duration: 1, ease: "easeInOut" },
                  opacity: {
                    duration: 2,
                    times: [0, 0.5, 0.5, 1],
                  },
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {CoverBaseDecor}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};