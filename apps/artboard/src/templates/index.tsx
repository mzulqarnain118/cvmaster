import { Template } from "@reactive-resume/utils";

import { Azurill } from "./azurill";
import { Bronzor } from "./bronzor";
import { Chikorita } from "./chikorita";
import { Ditto } from "./ditto";
import { Gengar } from "./gengar";
import { Glalie } from "./glalie";
import { Kakuna } from "./kakuna";
import { Leafish } from "./leafish";
import { Nosepass } from "./nosepass";
import { Onyx } from "./onyx";
import { Pikachu } from "./pikachu";
import { Rhyhorn } from "./rhyhorn";
import { CoverLetter1 } from "./cl-1";
import { CoverLetter4 } from "./cl-4";
import { CoverLetter2 } from "./cl-2";
import { CoverLetter3 } from "./cl-3";

export const getTemplate = (template: Template) => {
  switch (template) {
    case "azurill": {
      return Azurill;
    }
    case "cl-1": {
      return CoverLetter1;
    }

    case "bronzor": {
      return Bronzor;
    }
    case "chikorita": {
      return Chikorita;
    }
    case "cl-4": {
      return CoverLetter4;
    }
    case "ditto": {
      return Ditto;
    }
    case "gengar": {
      return Gengar;
    }
    case "glalie": {
      return Glalie;
    }
    case "cl-2": {
      return CoverLetter2;
    }
    case "kakuna": {
      return Kakuna;
    }
    case "leafish": {
      return Leafish;
    }
    case "nosepass": {
      return Nosepass;
    }
    case "onyx": {
      return Onyx;
    }
    case "cl-3": {
      return CoverLetter3;
    }
    case "pikachu": {
      return Pikachu;
    }
    case "rhyhorn": {
      return Rhyhorn;
    }
    default: {
      return Onyx;
    }
  }
};
