export function useDimentions(canvas: HTMLCanvasElement, frame = {top: 0, bottom: 0}) {
  const height = canvas.getBoundingClientRect().height
  const width = canvas.getBoundingClientRect().width
  return { height, width, 
    dimentions: {
      left: 0, 
      top: 0 + frame.top, 
      right: width, 
      bottom: height - frame.bottom
     }
  }
}