// Imports
import { useEffect, useState } from "react";
import axios from 'axios';
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import {useAddFormContext} from "../hooks/useAddFormContext"

// Import components
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";

// API base url
const baseURL = import.meta.env.VITE_API_BASE_URL

const Home = () => {
  // const [workouts, setWorkouts] = useState([])
  const {workouts, dispatch} = useWorkoutsContext()
  const {isAddFormVisible, dispatchAdd} = useAddFormContext()
  const [myWorkouts, setMyWorkouts] = useState(null)
  const [addOpen, setAddOpen] = useState(false)

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await axios.get(`${baseURL}/workouts`)

      // check response status is OK (200)
      if (response.status === 200) {
        console.log(response.data);
        // setWorkouts(response.data)
        dispatch({type: 'SET_WORKOUTS', payload: response.data})
      }
    }

    fetchWorkouts()
  }, [])

  const handleMyWorkouts = () => {
    setMyWorkouts(true)
  }

  const handleAllWorkouts = () => {
    setMyWorkouts(null)
  }

  const handleAddOpen = () => {
    dispatchAdd({type: 'OPEN_ADD'})
  }

  return (
    <div className='home'>
      <div className="home-buttons">
        <button onClick={handleMyWorkouts}>My Workouts</button>
        <button onClick={handleAllWorkouts}>All Workouts</button>
        <button onClick={handleAddOpen}><i className="fa-solid fa-plus"></i> Add Workout</button>
      </div>
      {isAddFormVisible && <WorkoutForm/>}
      <div className="workouts">
        {/* if workouts exist - map over the array */}
        {myWorkouts ? (
          workouts && workouts.map((workout) => {
            const user = JSON.parse(localStorage.getItem('user'))
            const user_id = user.email
            if (workout.user_id === user_id) {
              return (
                <WorkoutDetails key={workout._id} workout={workout}/> 
              )
            }
          })
        ) : (
          workouts && workouts.map((workout) => {
            const user = JSON.parse(localStorage.getItem('user'))
            const user_id = user.email
              return (
                <WorkoutDetails key={workout._id} workout={workout}/> 
              )
          })
        ) }
      </div>
    </div>
  )
}

export default Home
