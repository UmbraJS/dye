import tinycolor from "tinycolor2"

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
}

export interface Myriad {
  background?: string,
  foreground?: string,
  accents?: string[],
  generated?: MyriadOutput | null,
  readability?: number,
  subSchemes?: {
    [key: string]: Myriad
  }
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

export const defaultScheme: Myriad = {
  background: '#090233',
  foreground: '#ff5555',
  accents: ['#5200ff'],
  
  generated: null,
  readability: 2,

  subSchemes: {},
}
