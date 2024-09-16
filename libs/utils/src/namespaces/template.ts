export const templatesList = [
  "azurill",
  "bronzor",
  "chikorita",
  "ditto",
  "gengar",
  "glalie",
  "kakuna",
  "leafish",
  "nosepass",
  "onyx",
  "pikachu",
  "rhyhorn",
  // "cl-azurill",
  // "cl-bronzor",
  // "cl-chikorita",
  // "cl-ditto",
  // "cl-gengar",
  // "cl-glalie",
  // "cl-kakuna",
  // "cl-leafish",
  // "cl-nosepass", 
  
] as const;

export type Template = (typeof templatesList)[number];
