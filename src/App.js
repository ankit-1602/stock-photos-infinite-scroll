import React, { useState, useEffect } from 'react'
import { FaSearch } from 'react-icons/fa'
import Photo from './Photo'

const clientID = `?client_id=${process.env.REACT_APP_ACCESS_KEY}`
const mainUrl = `https://api.unsplash.com/photos/`
const searchUrl = `https://api.unsplash.com/search/photos/`

function App() {
  const [loading,setLoading]=useState(false)
  const [photos,setPhotos]=useState([])
  const [page,setPage]=useState(0)
  const [query,setQuery]=useState('')

  const fetchImages=async()=>{
    setLoading(true)
    let url;
    const urlPage=`&page=${page}`
    const searchQuery=`&query=${query}`
    if(query){
      url=`${searchUrl}${clientID}${urlPage}${searchQuery}`
    }
    else{
      url=`${mainUrl}${clientID}${urlPage}`
    }
    try {
      const response=await fetch(url)
      const data=await response.json()
      console.log(data)
      setPhotos((oldPhotos)=>{
        if(query && page===1){
            return data.results;
        }
        else if(query){
          return [...oldPhotos,...data.results]
        }
          return [...oldPhotos,...data]
      })
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchImages()
    // eslint-disable-next-line
  },[page])

  useEffect(()=>{
      const event=window.addEventListener('scroll',()=>{
         // console.log(`Inner Height : ${window.innerHeight}`)
         // console.log(`scrollY      : ${window.scrollY}`)
         // console.log(`Body Height  : ${document.body.scrollHeight}`)
        if(!loading && window.innerHeight + window.scrollY >= document.body.scrollHeight - 2)
        {
            //console.log(document.body.scrollHeight)
            setPage((old)=> old + 1)
        }
      })
      return () => window.removeEventListener('scroll',event);
      // eslint-disable-next-line
  },[])

  const handleSubmit=(e)=>{
      e.preventDefault();
      setPage(1)
    }

  return <main>
    <section className="search">
      <form className="search-form">
        <input 
          type="text" 
          className="form-input" 
          placeholder="Search..."
          value={query}
          onChange={(e)=>setQuery(e.target.value)}
        />
        <button 
          type="button"
          className="submit-btn"
          onClick={handleSubmit}
        >
            <FaSearch />
        </button>
      </form>
    </section>

    <section className="photos">
      <div className="photos-center">
        {photos.map((image)=>{
            //console.log(image)
            return <Photo key={image.id} {...image}/>
        })}
      </div>
      {loading && <h2 className="loading">loading...</h2>}
    </section>
  </main>
}

export default App
 