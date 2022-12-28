import { createScheme } from '..'
import { getReadable, makeReadable } from './color'
import { MyriadOutput, GenColor } from '../config'
//import  { adjustColors, accent } from "../adjust"
//import { generateColor } from "../generator"

const htmlElement = document.documentElement

export const distributeScheme = (
  scheme = createScheme(),
  element = htmlElement,
) => {
  const { 
    background, 
    foreground, 
    accents, 
    //settings
  } = scheme
  if(!background) return
  if(!foreground) return //TODO: clean this up, only background is needed
  setBackground(background, element)
  setForeground(foreground, element)
  setAccents({accents, element})
  
  //setSettings(settings, element)
  setOthers(scheme, element)
}

const setProperty = (name: string, value: string, element: HTMLElement) => {
  element.style.setProperty(name, value)
}

//const setSettings = (settings, element) => {
//  if(!settings) return
//  setProperty('--link', settings.link, element)
//}

const setOthers = (scheme: MyriadOutput, element: HTMLElement) => {
  if(!scheme.foreground) return
  const { foreground, background } = scheme
  
  const imgColor = getReadable(foreground.color, 'black', 19)
  const imgColorContrast = getReadable(foreground.color, 'white', 19)
  setProperty('--imgColor', imgColor, element)
  setProperty('--imgColor-contrast', imgColorContrast, element)
  setProperty('--link', makeReadable("#6b6bff", foreground.color, background?.color, 7), element) // TODO: make this prettier
  setProperty('color', 'var(--foreground)', element) // this line makes sure that subschemes change their color if needed

  /*TODO: make color system extendible with the ability to add custom color logic
  const schemex = {
    ...scheme,
    custom: {
      imgColor: (s) => getReadable(s.foreground.color, 'black', 19), //this should be a generated object with a contrast property
      success: '#00ff00',
      error: '#ff0000',
      link: '#0000ff',
      test: {color: '#ff0000', shade: ['#ff0000', '#ff0000', '#ff0000']},
    },
  }

  const makeArray = (obj) => {
    const objArray = Object.entries(obj)
    return objArray.map(([key, value]) => {
      return {[key]: value}
    })
  }
  
  const generateCustomColors = (array) => {
    return array.map((obj) => {
      const key = Object.keys(obj)[0]
      const value = Object.values(obj)[0]

      const isObject = typeof value === 'object'
      const isArray = Array.isArray(value)

      if(!isObject && !isArray) return {[key]: getColorValue(value)}
      if(isArray) return {[key]: value.map((v) => getColorValue(v))}
      if(isObject) return {[key]: generateCustomColors(makeArray(value))}
    })
  }

  /*const getColorValue = (value) => {
    let color = value

    typeof value === 'function'
      ? color = value(scheme)
      : color = accent(value, scheme).toHexString()

    return {color}
  }*/

  //console.log("rex: red", generateCustomColors(makeArray(schemex.custom)))

  //set colors
  /*const setColors = (obj, element) => {
    const key = Object.keys(obj)[0]
    const value = Object.values(obj)[0]
    const isArray = Array.isArray(value)
    if(!isArray) setProperty('--' + key, value.color, element)
  }*/

}

const setBackground = (background: GenColor, element: HTMLElement) => {
  if(!background) return
  setProperty('--background', background.color, element)
  setProperty('--shade', background.shade, element)
  setProperty('--shade-faint', background.shade2, element)
}

const setForeground = (foreground: GenColor, element: HTMLElement) => {
  if(!foreground) return
  setProperty('--foreground', foreground.color, element)
  setProperty('--foreground-shade', foreground.shade, element)
  setProperty('--foreground-shade-faint', foreground.shade2, element)
}

interface AccentsInterface {
  accents?: GenColor[]
  element: HTMLElement
}

const setAccents = (props: AccentsInterface) => {
  const { accents, element } = props
  if(!accents) return
  accents.forEach((fl: GenColor, index: number) => {
    setAccent(index, fl, element)
  })
}

const setAccent = (index: number, fl: GenColor, element: HTMLElement) => {
  let name = '--accent'
  let id = index > 0 ? index : ''
  setProperty(name + id, fl.color, element)
  setProperty(name + id + '-shade', fl.shade, element)
  setProperty(name + id + '-shade-faint', fl.shade2, element)
  setProperty(name + id + '-contrast', fl.contrast, element)
}

export default distributeScheme
