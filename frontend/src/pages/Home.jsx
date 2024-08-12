// Imports
import { useEffect, useState } from "react";
import axios from 'axios';
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAddFormContext } from "../hooks/useAddFormContext";

// Import components
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";

// API base url
const baseURL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { isAddFormVisible, dispatchAdd } = useAddFormContext();
  const [myWorkouts, setMyWorkouts] = useState(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const response = await axios.get(`${baseURL}/workouts`);
        if (response.status === 200) {
          console.log(response.data);
          dispatch({ type: 'SET_WORKOUTS', payload: response.data });
        }
      } catch (error) {
        console.error("Error fetching workouts:", error);
      }
    };

    fetchWorkouts();
  }, [dispatch]);

  const handleMyWorkouts = () => {
    setMyWorkouts(true);
  };

  const handleAllWorkouts = () => {
    setMyWorkouts(false);
  };

  const handleAddOpen = () => {
    dispatchAdd({ type: 'OPEN_ADD' });
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const user_id = user?.email;

  // Determine which workouts to display based on `myWorkouts`
  const filteredWorkouts = myWorkouts
    ? workouts?.filter(workout => workout.user_id === user_id) || []
    : workouts || [];

  return (
    <div className='home'>
      <div className="home-buttons">
        <button onClick={handleMyWorkouts}>My Workouts</button>
        <button onClick={handleAllWorkouts}>All Workouts</button>
        <button onClick={handleAddOpen}>
          <i className="fa-solid fa-plus"></i> Add Workout
        </button>
      </div>
      {isAddFormVisible && <WorkoutForm />}
      <div className="workouts">
        {filteredWorkouts.length > 0 ? (
          filteredWorkouts.map(workout => (
            <WorkoutDetails key={workout._id} workout={workout} />
          ))
        ) : (
          <div className="no-workouts">
            <p>No Workouts added</p>
            <p>Please add a Workout</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
