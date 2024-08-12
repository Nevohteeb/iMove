import { useState } from 'react';
import axios from 'axios';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import { useAddFormContext } from '../hooks/useAddFormContext';

const baseURL = import.meta.env.VITE_API_BASE_URL;

const WorkoutForm = () => {
    const { dispatch } = useWorkoutsContext();
    const { dispatchAdd } = useAddFormContext();

    const [title, setTitle] = useState('');
    const [load, setLoad] = useState('');
    const [reps, setReps] = useState('');
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem('user'));
        const user_id = user.email;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('load', load);
        formData.append('reps', reps);
        formData.append('user_id', user_id);
        formData.append('image', image);

        try {
            const response = await axios.post(`${baseURL}/workouts`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setTitle('');
            setLoad('');
            setReps('');
            setError(null);
            console.log('New Workout Added!', response.data);

            dispatch({ type: "CREATE_WORKOUT", payload: response.data });
            dispatchAdd({ type: 'CLOSE_ADD' });

        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    };

    return (
        <form className='create' onSubmit={handleSubmit}>
            <button className="close-button" onClick={(e) => {
                e.preventDefault();
                dispatchAdd({ type: 'CLOSE_ADD' });
            }}>
                <i className="fa-solid fa-xmark"></i>
            </button>
            <h3>Add a New Workout:</h3>

            <label>Exercise Title</label>
            <input
                type='text'
                onChange={(e) => setTitle(e.target.value)}
                value={title}
            />

            <label>Load (in kg):</label>
            <input
                type='text'
                onChange={(e) => setLoad(e.target.value)}
                value={load}
            />

            <label>Reps:</label>
            <input
                type='text'
                onChange={(e) => setReps(e.target.value)}
                value={reps}
            />

            <label>Upload Image:</label>
            <input
                type='file'
                accept='image/*'
                onChange={(e) => setImage(e.target.files[0])}
            />

            <button>Add Workout</button>
            {error && <div className='error'>{error}</div>}
        </form>
    );
};

export default WorkoutForm;
