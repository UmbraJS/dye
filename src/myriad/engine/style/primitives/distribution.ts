//Color configs
import { styleScheme } from '../config'

export interface Property {
  key: string,
  value: string | number
}

export const distributeStyle = (scheme = styleScheme, scopeElement = document.documentElement) => {
  eachPropDeep(scheme, (prop: Property) => {
    setVariable({key: prop.key, value: prop.value}, scopeElement)
  })
}

const eachProp = (object: object, callback: Function, preface = "") => {
  //Executes a callback on each prop in an object
  Object.entries(object).forEach(([key, value]) => {
    callback({key: preface + key, value})
  })
}

const eachPropDeep = (object: object, callback: Function) => {
  //Executes a callback on each prop in an object. 
  //Also recursively calls itself on any nested objects(only one layer down)
  //also turns the the key into a preface when recursively calling. 
  //I.E: {font: {size: 16}} becomes --font-size: 16 instead of --size: 16;
  Object.entries(object).forEach(([key, value]) => {
    if(typeof value === 'object') {
      eachProp(value, (p: Property) => callback(p), key + "-")
    } else {
      callback({key, value})
    }
  })
}

const setVariable = (content: Property, scopeElement: HTMLElement) => {
  //Sets a css *variable* on a scope element
  const value = typeof content.value === 'number' ? 
    content.value + "px" : 
    content.value

  setProperty({key: "--" + content.key, value: value}, scopeElement)
}

const setProperty = (content: Property, scopeElement: HTMLElement) => {
  //Sets a css *property* on a scope element
  scopeElement.style.setProperty(content.key, "" + content.value)
}

export default distributeStyle
