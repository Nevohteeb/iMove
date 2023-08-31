import {useState, useEffect} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

const SingleWorkout = () => {
    const navigate = useNavigate()
    const {id} = useParams()
    // set a state for the single workout
    const [workout, setWorkout] = useState(null)
    // set a loading state
    const [loading, setLoading] = useState(true)

    // axios call to get single workout:
    useEffect(() => {
        axios.get(`http://localhost:4000/api/workouts/${id}`)
            .then((res) => {
                console.log(res.data)
                console.log(res.data[0])
                setWorkout(res.data[0])
                setLoading(false)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [id])

    // check if load is true and return ladoing text if it is
    if (loading) {
        return <h4>Loading...</h4>
    }

  return (
      <>
        <button onClick={() => navigate(-1)}>Go Back</button>
        <div>{workout.title}</div>
        <p>Reps: {workout.reps}</p>
        <p>Load: {workout.load}</p>
      </>
  )
}

export default SingleWorkout
