function getPercent(props: {height: number, width: number, heightLimit: number, widthLimit: number}) {
  const {height, width, heightLimit, widthLimit} = props
  const height100 = height / 100
  const h1 = (100 - Math.abs(heightLimit)) * height100
  const width100 = width / 100
  const w1 = (100 - Math.abs(widthLimit)) * width100
  return {h1, w1}
}

export function useDimentions(canvas: HTMLCanvasElement, frame = {height: 100, width: 100}) {
  const {height, width} = canvas.getBoundingClientRect()
  const { w1, h1 } = getPercent({
    height, width, 
    heightLimit: frame.height, 
    widthLimit: frame.width
  })
  
  const h = frame.height >= 0 ? 0 + h1 : 0 - h1
  const w = frame.width >= 0 ? 0 + w1 : 0 - w1

  return { height, width, 
    dimentions: {
      left: w,
      top: h, 
      right: width, 
      bottom: height 
     }
  }
}