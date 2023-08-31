import { useState } from 'react';
import axios from 'axios';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useNavigate } from 'react-router-dom';

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const navigate = useNavigate()

  const handleNavigate = () => {
    let path = `/${workout._id}`
    navigate(path)
  }

  // Editing State
  const [isEditing, setIsEditing] = useState(false);
  // State for our edit form
  const [editTitle, setEditTitle] = useState(workout.title);
  const [editLoad, setEditLoad] = useState(workout.load);
  const [editReps, setEditReps] = useState(workout.reps);

  const handleDelete = async () => {
    const response = await axios.delete(`http://localhost:4000/api/workouts/${workout._id}`);

    const json = await response.data;
    if (response.status === 200) {
      console.log(json);
      dispatch({ type: 'DELETE_WORKOUT', payload: json });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditTitle(workout.title);
    setEditLoad(workout.load);
    setEditReps(workout.reps);
    setIsEditing(false);
  };

  const handleSubmitEdit = async () => {
    // defining the object to send up
    const updatedWorkout = {
      title: editTitle,
      load: editLoad,
      reps: editReps,
    };

    // axios
    try {
      const response = await axios.patch(
        `http://localhost:4000/api/workouts/${workout._id}`,
        updatedWorkout
      );

      const updatedData = response.data;
      if (response.status === 200) {
        console.log(updatedData);
        dispatch({ type: 'UPDATE_WORKOUT', payload: updatedData });
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error Updating Workout: ', error);
    }
  };

  const user = JSON.parse(localStorage.getItem('user'));
  const user_id = user.email; // Make sure this is the correct property that holds the user ID

  return (
    <div className="workout-details">
      {isEditing ? (
        <div className='edit-modal'>
          <label>Edit Exercise Title:</label>
          <input
            type='text'
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <label>Edit Load (kg):</label>
          <input
            type='number'
            value={editLoad}
            onChange={(e) => setEditLoad(e.target.value)}
          />

          <label>Edit Reps</label>
          <input
            type='number'
            value={editReps}
            onChange={(e) => setEditReps(e.target.value)}
          />

          <button onClick={handleSubmitEdit}>Save</button>
          <button onClick={handleCancelEdit}>Cancel</button>
        </div>
      ) : (
        <>
          <h4>{workout.title}</h4>
          {workout.image && (
            <img 
              className='workout-image' 
              src={`http://localhost:4000/public/uploads/${workout.image}`}
              alt={workout.title}
            />
          )}
          <p>
            <strong>Weight (kg):</strong> {workout.load}
          </p>
          <p>
            <strong>Reps:</strong> {workout.reps}
          </p>
          <p>
            {formatDistanceToNow(new Date(workout.createdAt), {
              includeSeconds: true,
            })}{' '}
            ago
          </p>
          <p>
            <strong>Created by: </strong>
            {workout.user_id}
          </p>
          {workout.user_id === user_id && (
            <>
              <span className='delete' onClick={handleDelete}>
                <i className='fa-solid fa-ban'></i>
              </span>
              <span className='edit' onClick={handleEdit}>
                <i className='fa-solid fa-pen'></i>
              </span>
            </>
          )}
          <button onClick={handleNavigate}>Read More</button>
        </>
      )}
    </div>
  );
};

export default WorkoutDetails;
