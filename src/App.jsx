import { useState, useEffect } from 'react'
import './styles.css'
import examplePixels2 from './examples/examplePixels2'

export default function App() {
  const [pixels, setPixels] = useState([])
  const [mouseDown, setMouseDown] = useState(false) 
  const [wantsToDraw, setWantsToDraw] = useState(true) 
  const [resetRequested, setResetRequested] = useState(false)


  useEffect(() => {
    const initialPixels = new Array(3600)
      .fill('')
      .map(() => ({ id: crypto.randomUUID(), filled: false }))
    setPixels(initialPixels)
  }, [])


  function handleMouseDown() {
    setMouseDown(true)
  }

  function handleMouseUp() {
    setMouseDown(false)
  }


  function handleMouseEnter(pixelId) {
    if (mouseDown) {
      setPixels((prevPixels) => 
        prevPixels.map((pixel) =>
          pixel.id === pixelId
            ? { ...pixel, filled: wantsToDraw }  
            : pixel
        )
      )
    }
  }

  function reset() {
    setResetRequested(true)
  }


  function togglePencil() {
    setWantsToDraw((pre) => !pre)
  }

  useEffect(() => {
    let timeoutOne
    let timeoutTwo

    if (resetRequested) {
      timeoutOne = setTimeout(() => {
        setPixels((prevPixels) =>
          prevPixels.map((pixel) => ({ ...pixel, filled: false }))
        )
      }, 1000)
    }

    if (resetRequested) {
      timeoutTwo = setTimeout(() => {
        setResetRequested(false)
      }, 1001)
    }

    return () => {
      clearTimeout(timeoutOne)
      clearTimeout(timeoutTwo)
    }
  }, [resetRequested])


  const pixelElements = pixels.map((pixel) => (
    <div
      key={pixel.id}
      id={pixel.id}
      className={`pixel ${pixel.filled ? 'filled' : 'empty'}`}
      onMouseEnter={() => handleMouseEnter(pixel.id)}  // Mouse piksele girdiğinde
    ></div>
  ))

  return (
    <div className='wrapper' onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
      <div
        className={`sketch-o-matic-container ${resetRequested && 'shake-horizontal'}`}
      >
        <h1>Eskiz-a-Matik</h1>
        <div
          className={`canvas ${wantsToDraw ? 'draw' : 'erase'} ${resetRequested && 'fade-out'}`}
        >
          {pixelElements}
        </div>
        <div className='button-container'>
          <button onClick={reset}>Reset</button>
          <button onClick={togglePencil}>{wantsToDraw ? 'Çiz' : 'Sil'}</button>
        </div>
      </div>
    </div>
  )
}
