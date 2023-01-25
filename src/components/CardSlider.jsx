import React, { useRef, useState } from "react"
import Card from "./Card"
import styled from "styled-components"

export default function CardSlider({ data, title }) {
  const listRef = useRef()
  const [showControls, setShowControls] = useState(false)
  const [sliderPosition, setSliderPosition] = useState(0)
  return (
    <Container
      className="flex column"
      showControls={showControls}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <h1>{title}</h1>
      <div className="wrapper">
        <div
          className={`slider-action left ${!showControls ? "none" : ""} 
          flex j-center a-center`}
        ></div>
      </div>
      <div className="flex">
        {data.map((movie, index) => {
          return <Card movieData={movie} index={index} key={movie.id} />
        })}
      </div>
    </Container>
  )
}

const Container = styled.div``
