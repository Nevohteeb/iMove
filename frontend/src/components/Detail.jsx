import axios from 'axios'
import {useState, useEffect} from 'react'
import { useProjectsContext } from '../hooks/useProjectsContext'
import { useParams } from 'react-router-dom'

// react-icons
import {IoMdArrowRoundBack} from 'react-icons/io'

const baseURL = import.meta.env.VITE_API_BASE_URL
const appURL = import.meta.env.VITE_APP_URL

const DetailPage = () => {
  const {dispatch} = useProjectsContext()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const {id} = useParams()

   // Editing State
   const [isEditing, setIsEditing] = useState(false)
   //state for our edit form:
   const [editTitle, setEditTitle] = useState(null)
   const [editImage, setEditImage] = useState(null)
   const [editPrototype_url, setEditPrototype_url] = useState(null)
   const [editDescription, setEditDescription] = useState(null)

  useEffect(() => {
    axios.get(`${baseURL}/projects/${id}`)
    .then((res) => {
      console.log(res.data);
      setProject(res.data[0])
      setEditTitle(res.data[0].title)
      setEditImage(res.data[0].image)
      setEditPrototype_url(res.data[0].prototype_url)
      setEditDescription(res.data[0].description)
      setLoading(false)
    }).catch((error) => {
      console.log(error);
    })
    
  },[id])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    if(project){
      setEditTitle(project.title)
      setEditImage(project.image)
      setEditPrototype_url(project.prototype_url)
      setEditDescription(project.description)
    }
    
    setIsEditing(false)
  }

  const handleSubmitEdit = async() => {
    const updateProject = {
      title: editTitle,
      image: editImage,
      prototype_url: editPrototype_url,
      description: editDescription
    }

    try {
      const response = await axios.patch(
        `${baseURL}/projects/${project._id}`,
        updateProject
      )
      const updatedData = response.data

      if (response.status === 200) {
        console.log(updateProject);
        dispatch({type: 'UPDATE_PROJECT', payload: updatedData})
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Error updating project:',error);
    }
  }

  const handleDelete = async() => {
    const response = await axios.delete(`${baseURL}/projects/${project._id}`)
    const json = await response.data
    
    if(response.status === 200) {
      console.log(json, 'is deleted');
      dispatch({type: 'DELETE_PROJECT', payload: json})
    }
  }

  const user = JSON.parse(localStorage.getItem('user'))
  const user_id = user.username

  if(loading) {
    return <>loading...</>
  }
  return (
    <div>
    {isEditing ? (
      <div className='edit-detail'>

        <label>Edit Title</label>
        <input
          type='text'
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
        />

        <label>Edit Image</label>
        <input
          type='file'
          accept='image/*'
          onChange={(e) => setEditImage(e.target.files[0])}
        />

        <label>Link to Prototype</label>
        <input
          type='text'
          value={editPrototype_url}
          onChange={(e) => setEditPrototype_url(e.target.value)}
        />

        <label>Project Description</label>
        <input
          type='text'
          value={editDescription}
          onChange={(e) => setEditDescription(e.target.value)}
        />

        <button className='save-edit' onClick={handleSubmitEdit}>Save</button>
        <button className='cancel-edit' onClick={handleCancelEdit}>Cancel</button>

      </div>
      ) : (
      <div className='detail-page'>
        <h3>{project.title}</h3>
        <p>Project Owner: {project.user_id}</p>
        {project.image && (
          <img
            src = {`${appURL}/public/uploads/${project.image}`}
            alt = {project.title}
          />
        )}

        <p>{project.description}</p>
        <h5>Prototype</h5>
        <p>{project.prototype_url}</p>
        {project.user_id === user_id &&
        <>
          <p>
            <span className='edit' onClick={handleEdit} >
            Edit 
            </span>
            |
            <span className='delete' onClick={handleDelete}> 
              Delete
            </span>
            </p>
        </>
        }
        <div>
          <IoMdArrowRoundBack/>
          <span>Go Back</span>
        </div>

      </div>
    )}
  </div>

  )
}

export default DetailPage