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
  "cl-1",
  "cl-2",
   "cl-3",
   "cl-4",
  //  "cl-5",
  //  "cl-6",
  //  "cl-7",
  //  "cl-8",
  //  "cl-9",
  //  "cl-10"
] as const;

export type Template = (typeof templatesList)[number];
