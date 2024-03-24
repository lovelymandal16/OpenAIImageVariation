import { useState } from "react"
import Modal from "./components/Modal"
const App = () => {
  const [images, setImages] = useState(null)
  const [value,setValue] = useState(null)
  const [error , setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const surpriseOptions = [
    'Yellow fruit baskets', 
    'A pipeapple sunbathing', 
    'Planet in the universe',
    'dogs on the beach',
    'Rain in a forest',
    'cucumber of different sizes'
  ]
  const surpriseMe = () => {
    setImages(null)
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randomValue)
  }
  const getImages = async() => {
    setImages(null)
    if(value === null){
      setError('Must have a serch term')
      return
    }
    try{
      const options = {
        method: "POST", 
        body:JSON.stringify({
          message: value
        }),
        headers:{
          "Content-type":"application/json"
        }
      }
      const response = await fetch('http://localhost:8000/images',options)
      const data = await response.json()
      console.log(data)
      setImages(data)
    }
    catch(error){
      console.log(error)
    }
  }
  const uploadImage = async (e) => {
    console.log(e.target.files[0])
    const formData = new FormData()
    formData.append('file',e.target.files[0])
    setModalOpen(true)
    setSelectedImage(e.target.files[0])
    e.target.value = null
    try{
      const options = {
        method: "POST",
        body: formData
      }
      const response = await fetch ('http://localhost:8000/upload', options)
      const data =  await response.json() 
      console.log(data)
    }
    catch(error){
      console.error(error)
    }
  }

  const generateVariations = async() =>{
    setImages(null)
    if(selectedImage === null){
      setError('Error ! Must have an existing image')
      setModalOpen(false)
      return
    }
    try{
      const options = {
        method :'POST'

      }
      const response = await fetch('http://localhost:8000/variations', options)
      const data = await response.json()
      console.log(data)
      setImages(data)
      setError(null)
      setModalOpen(false)
    }
    catch(error){
      console.error(error)

    }
  }

  return (
    <div className="app">
      <section className="search-section">
        <p>Start with a detailed description
          <span className="surprise" onClick={surpriseMe}>Suprise me</span>
        </p>
        <div className="input-container">
          <input 
          value={value}
          placeholder="An oil painting of an sunflower in a purple vase ..."
          onChange={e =>setValue(e.target.value)}/>
          <button onClick={getImages}>Generate</button>
        </div>
        <p className="extra-info"> Or, 
        <span>
          <label htmlFor="files"> upload an image </label>
          <input onChange={uploadImage} id="files" accept="image/*" type="file" hidden/>
        </span>
           to edit.
        </p>
        { error && <p>{error}</p>}
        {modalOpen && <div className="overlay">
          <Modal setModalOpen = {setModalOpen}  setSelectedImage={setSelectedImage} selectedImage={selectedImage} generateVariations={generateVariations}/>
        </div>}
      </section>
      <section className="image-section">
        {images?.map((image,_index) => (
          <img key={_index} src={image.url} alt={`Generated image of ${value}`}/>
        ))}
      </section>
    </div>
  );
}

export default App;
