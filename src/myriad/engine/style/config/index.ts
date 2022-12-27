export interface FontInterface {
  size: number | string,
  line: number | string,
}

export interface StyleInterface {
  css?: string,
  radius?: number | string,
  border?: string,
  space?: number | string,
  font?: FontInterface
}

export const styleScheme: StyleInterface = {
  css: "",
  radius: 10,
  border: "solid 1px var(--foreground)",
  space: 20,
  font: {
    size: 16,
    line: 1.5,
  }
}

export default styleScheme
