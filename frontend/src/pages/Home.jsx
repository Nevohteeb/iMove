// Imports
import { useEffect, useState } from "react";
import axios from 'axios';
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";

// Import components
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";

const Home = () => {
  // const [workouts, setWorkouts] = useState([])
  const {workouts, dispatch} = useWorkoutsContext()
  const [myWorkouts, setMyWorkouts] = useState(null)

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await axios.get('http://localhost:4000/api/workouts')

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

  return (
    <div className='home'>
      <div className="workouts">
        <button onClick={handleMyWorkouts}>My workouts</button>
        <button onClick={handleAllWorkouts}>All workouts</button>
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
      <WorkoutForm/>
    </div>
  )
}

export default Home
