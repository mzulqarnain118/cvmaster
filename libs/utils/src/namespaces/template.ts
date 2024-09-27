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
  // "cl-1",
  // "cl-2",
  // "cl-3",
  // "cl-4",
] as const;

export type Template = (typeof templatesList)[number];

export const CoverLettertemplatesList = [
  "bronzor",
  "chikorita",
  "kakuna",
  "onyx",
  "rhyhorn",
] as const;

export type CoverLettertemplatesList = (typeof templatesList)[number];
