export const NOTE_COLOR_IDS = [
  "yellow",
  "peach",
  "stone",
  "violet",
  "lime",
  "pink",
] as const;

export type NoteColorId = (typeof NOTE_COLOR_IDS)[number];

export const DEFAULT_NOTE_COLOR: NoteColorId = "yellow";

export const NOTE_COLOR_STYLES: Record<
  NoteColorId,
  {
    light: {
      bg: string;
      border: string;
      shadow: string;
      accent: string;
      pin: string;
    };
    dark: {
      bg: string;
      border: string;
      shadow: string;
      accent: string;
      pin: string;
    };
    swatch: string;
    label: string;
  }
> = {
  yellow: {
    light: {
      bg: "bg-[#ffcf73]",
      border: "border-[#f3c568]",
      shadow: "shadow-[0_14px_30px_-22px_rgba(205,152,35,0.45)]",
      accent: "#f1b53d",
      pin: "text-[#f1b53d]",
    },
    dark: {
      bg: "bg-[#5f4621]",
      border: "border-[#7e6230]",
      shadow: "shadow-[0_14px_30px_-22px_rgba(205,152,35,0.35)]",
      accent: "#ffcf73",
      pin: "text-[#ffcf73]",
    },
    swatch: "bg-[#ffcf73]",
    label: "Amarilla",
  },
  peach: {
    light: {
      bg: "bg-[#ff9a74]",
      border: "border-[#f58a63]",
      shadow: "shadow-[0_14px_30px_-22px_rgba(222,107,63,0.45)]",
      accent: "#ef774e",
      pin: "text-[#ef774e]",
    },
    dark: {
      bg: "bg-[#673525]",
      border: "border-[#8a4b36]",
      shadow: "shadow-[0_14px_30px_-22px_rgba(222,107,63,0.35)]",
      accent: "#ff9a74",
      pin: "text-[#ff9a74]",
    },
    swatch: "bg-[#ff9a74]",
    label: "Durazno",
  },
  stone: {
    light: {
      bg: "bg-[#dedad3]",
      border: "border-[#cec8bf]",
      shadow: "shadow-[0_14px_30px_-22px_rgba(128,119,105,0.35)]",
      accent: "#bdb5aa",
      pin: "text-[#bdb5aa]",
    },
    dark: {
      bg: "bg-[#4a4641]",
      border: "border-[#666059]",
      shadow: "shadow-[0_14px_30px_-22px_rgba(128,119,105,0.3)]",
      accent: "#dedad3",
      pin: "text-[#dedad3]",
    },
    swatch: "bg-[#dedad3]",
    label: "Piedra",
  },
  violet: {
    light: {
      bg: "bg-[#b591ff]",
      border: "border-[#a886ef]",
      shadow: "shadow-[0_14px_30px_-22px_rgba(124,88,210,0.4)]",
      accent: "#9c78e8",
      pin: "text-[#9c78e8]",
    },
    dark: {
      bg: "bg-[#4b3b69]",
      border: "border-[#654f89]",
      shadow: "shadow-[0_14px_30px_-22px_rgba(124,88,210,0.32)]",
      accent: "#c8abff",
      pin: "text-[#c8abff]",
    },
    swatch: "bg-[#b591ff]",
    label: "Violeta",
  },
  lime: {
    light: {
      bg: "bg-[#dceb75]",
      border: "border-[#d0dd67]",
      shadow: "shadow-[0_14px_30px_-22px_rgba(164,177,70,0.4)]",
      accent: "#bed24f",
      pin: "text-[#bed24f]",
    },
    dark: {
      bg: "bg-[#59612a]",
      border: "border-[#798136]",
      shadow: "shadow-[0_14px_30px_-22px_rgba(164,177,70,0.32)]",
      accent: "#dceb75",
      pin: "text-[#dceb75]",
    },
    swatch: "bg-[#dceb75]",
    label: "Lima",
  },
  pink: {
    light: {
      bg: "bg-[#ffc8dd]",
      border: "border-[#f1bad0]",
      shadow: "shadow-[0_14px_30px_-22px_rgba(197,122,153,0.38)]",
      accent: "#e995b7",
      pin: "text-[#e995b7]",
    },
    dark: {
      bg: "bg-[#623a48]",
      border: "border-[#804e60]",
      shadow: "shadow-[0_14px_30px_-22px_rgba(197,122,153,0.32)]",
      accent: "#ffc8dd",
      pin: "text-[#ffc8dd]",
    },
    swatch: "bg-[#ffc8dd]",
    label: "Rosa",
  },
};
