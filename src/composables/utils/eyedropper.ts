import { colorName } from "../colorName"

function assignColor(hex: string) {
  colorName(hex)()
}

function notSupported() {
  if (!('EyeDropper' in window)) {
    console.log('EyeDropper API not supported')
    return true
  }
}

// @ts-ignore
const dropper = new window.EyeDropper()

function openDropper(fn = assignColor) {
  dropper.open().then((result: {sRGBHex: string}) => fn(result.sRGBHex))
}

export function eyeDropper(fn = assignColor) {
  if(notSupported()) return
  try { openDropper(fn) } 
  catch (err) { console.log(err) }
}