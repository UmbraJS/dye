import tinycolor from "tinycolor2"
import { getReadable, makeReadable } from '../primitives/color'

export interface GenColor {
  color: string;
  shade: string;
  shade2: string;
  contrast: string;
}

export interface MyriadOutput {
  background?: GenColor,
  foreground?: GenColor,
  accents?: GenColor[],
  origin: Myriad,
}

export interface Myriad {
  background?: string,
  foreground?: string,
  accents?: string[],
  generated?: MyriadOutput | null,
  readability?: number,
  subSchemes?: {
    [key: string]: Myriad
  },
  custom?: ColorList
}

interface MyriadAdjusted {
  background?: tinycolor.Instance,
  foreground?: tinycolor.Instance,
  accents?: tinycolor.Instance[],
  generated?: any,
  readability?: number,
  subSchemes?: {
    [key: string]: Myriad
  }
}

export interface AdjustedScheme extends MyriadAdjusted {
  origin: Myriad,
}

export type customColor = string | ((s: Myriad) => string)
export interface ColorList {
  [key: string]: customColor
}

export const defaultScheme: Myriad = {
  background: '#090233',
  foreground: '#ff5555',
  accents: ['#5200ff'],
  
  generated: null,
  readability: 2,

  subSchemes: {},
  custom: {
    link: (s: Myriad) => {
      if(!s.foreground) return "black"
      const fcolor = s.foreground
      const bcolor = s.background
      const blue = '#6b6bff'
      const linkColor = makeReadable(blue, fcolor, bcolor, 7)
      return linkColor
    },
    imgColor: (s: Myriad) => {
      if(!s.foreground) return "black"
      return getReadable(s.foreground, 'black', 19)
    },
    success: '#00ff00',
    error: '#ff0000',
  }
}
