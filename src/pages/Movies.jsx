import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { onAuthStateChanged } from "firebase/auth"
import { firebaseAuth } from "../utils/firebase-config"
import { fetchMovies, getGenres } from "../store"
import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import Navbar from "../components/Navbar"
//import SelectGenre from "../components/SelectGenre"
import Slider from "../components/Slider"
import NotAvailable from "../components/NotAvailable"
import SelectGenre from "../components/SelectGenre"

export default function Movies() {
  const [isScrolled, setIsScrolled] = useState(false)
  const movies = useSelector((state) => state.netflix.movies)
  const genres = useSelector((state) => state.netflix.genres)
  const navigate = useNavigate()
  const genresLoaded = useSelector((state) => state.netflix.genresLoaded)

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getGenres())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (genresLoaded) dispatch(fetchMovies({ genres, type: "movies" }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genresLoaded])

  const [user, setUser] = useState(undefined)

  onAuthStateChanged(firebaseAuth, (currentUser) => {
    if (currentUser) setUser(currentUser.uid)
    // else navigate("/login")
  })

  window.onscroll = () => {
    setIsScrolled(window.pageYOffset === 0 ? false : true)
    return () => (window.onscroll = null)
  }

  return (
    <Container>
      <div className="navbar">
        <Navbar isScrolled={isScrolled} />
      </div>
      <div className="data">
        <SelectGenre genres={genres} type="movie" />
        {movies.length ? <Slider movies={movies} /> : <NotAvailable />}
      </div>
    </Container>
  )
}

const Container = styled.div`
  .data {
    margin-top: 8rem;
    .not-available {
      text-align: center;
      color: white;
      margin-top: 4rem;
    }
  }
`
