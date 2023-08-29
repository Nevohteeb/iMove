import { useState } from 'react';
import axios from 'axios';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';

const WorkoutForm = () => {
    // Bring in the dispatch
    const {dispatch} = useWorkoutsContext()

    // Form input state variables
    const [title, setTitle] = useState('');
    const [load, setLoad] = useState('');
    const [reps, setReps] = useState('');
    // set an error state
    const [error, setError] = useState(null);
    // set state for image uplaod
    const [image, setImage] = useState(null);

    // Handle Submit - Post request to our workout end point
    // prevent the default form button behaviour
    // data - create an object called workout and pass our state values into it
    // axios - send the data object up as the request payload
    // header - tells the server we are using JSON data
    // set error state - so we can show error to user later on
    // reset the values of the form if the request is successful

    const handleSubmit = async (e) => {
        e.preventDefault() // stop button from refreshing the page

        const user = JSON.parse(localStorage.getItem('user'))
        const user_id = user.email

        // data object to send as payload
        // const workout = {title, load, reps, user_id}

        const formData = new FormData()
        formData.append('title', title);
        formData.append('load', load);
        formData.append('reps', reps);
        formData.append('user_id', user_id);
        formData.append('image', image);

        try {
            const response = await axios.post('http://localhost:4000/api/workouts', formData, {
                headers: {
                    // 'Content-Type': 'application/json' // telling it to use and expect json
                    'Content-Type': 'multipart/form-data'
                }
            })

            // Clear values
            setTitle('');
            setLoad('');
            setReps('');
            setError(null);
            console.log('New Workout Added!', response.data);

            dispatch({type:"CREATE_WORKOUTS", payload: response.data})

        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }

  return (
    <form className='create' onSubmit={handleSubmit}>
        <h3>Add a New Workout: </h3>

        <label>Exercise Title</label>
        <input
          type='text'
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        >
        </input>

        <label>Load (in kg): </label>
        <input
          type='text'
          onChange={(e) => setLoad(e.target.value)}
          value={load}
        >
        </input>

        <label>Reps: </label>
        <input
          type='text'
          onChange={(e) => setReps(e.target.value)}
          value={reps}
        >
        </input>

        <label>Upload Image:</label>
        <input
          type='file'
          accpet='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button>Add Workout</button>
        {error && <div className='error'>{error}</div>}
    </form>
  )
}

export default WorkoutForm
