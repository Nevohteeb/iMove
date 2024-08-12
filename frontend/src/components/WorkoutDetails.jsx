import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useWorkoutsContext } from '../hooks/useWorkoutsContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';

const baseURL = import.meta.env.VITE_API_BASE_URL;
const bucket = import.meta.env.VITE_AWS_BUCKET_NAME;
const region = import.meta.env.VITE_AWS_REGION;

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const user = JSON.parse(localStorage.getItem('user'));
  const user_id = user.email;

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(workout.title);
  const [editLoad, setEditLoad] = useState(workout.load);
  const [editReps, setEditReps] = useState(workout.reps);
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleDelete = async () => {
    const response = await axios.delete(`${baseURL}/workouts/${workout._id}`);
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
    const updatedWorkout = {
      title: editTitle,
      load: editLoad,
      reps: editReps,
    };

    try {
      const response = await axios.patch(
        `${baseURL}/workouts/${workout._id}`,
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

  const handleAddComment = async () => {
    try {
        const response = await axios.post(
            `${baseURL}/comments/workouts/${workout._id}/comments`,
            {
                text: commentText,
                user_id: user_id,
            }
        );

        if (response.status === 201) {
            const newComment = response.data;
            const updatedComments = [...workout.comments, newComment];
            const updatedWorkout = { ...workout, comments: updatedComments };

            dispatch({ type: 'UPDATE_WORKOUT', payload: updatedWorkout });

            setCommentText('');
        }
    } catch (error) {
        console.error('Error Adding Comment: ', error);
    }
  };

  const getEmailCharactersBeforeAtSymbol = (email) => {
    const delimiter = '@';
    const parts = email.split(delimiter);
    return parts.length > 1 ? parts[0] : '';
  };

  const workoutCardClassName = `workout-details ${showComments ? 'expanded' : ''}`;

  return (
    <div className={workoutCardClassName}>
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

          <label>Edit Reps:</label>
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
          <img 
            className='workout-image' 
            src={workout.image 
              ? `https://${bucket}.s3.${region}.amazonaws.com/${workout.image}` 
              : '/img/No_Image_Available.jpg'} // Online placeholder image
            alt={workout.title}
          />
          <p>
            <strong>Weight (kg):</strong> {workout.load}
          </p>
          <p>
            <strong>Reps:</strong> {workout.reps}
          </p>
          <p>
            <strong>Posted:</strong> {formatDistanceToNow(new Date(workout.createdAt), {
              includeSeconds: true,
            })}{' '}
            ago
          </p>
          <p>
            <strong>Created by: </strong>
            {getEmailCharactersBeforeAtSymbol(workout.user_id)}
          </p>
          {workout.user_id === user_id && (
            <>
              <span className='delete' onClick={handleDelete}>
                <i className='fa-solid fa-trash'></i>
              </span>
              <span className='edit' onClick={handleEdit}>
                <i className='fa-solid fa-pen'></i>
              </span>
            </>
          )}
          <button onClick={() => {
            setShowComments(!showComments);
            console.log(workout.comments[0]);
          }}>
            {showComments ? 'Hide Comments' : 'Show Comments'}
          </button>
        </>
      )}

      {showComments && (
        <>
          <div className="comments">
            {workout.comments.map((comment) => (
              <div key={comment._id} className="comment">
                <h5>{getEmailCharactersBeforeAtSymbol(comment.user_id)}</h5>
                <p>{comment.text}</p>
                <span>Posted: {formatDistanceToNow(new Date(comment.createdAt), {
                  includeSeconds: true,
                })}{' '}
                ago</span>
              </div>
            ))}
          </div>
          <div className="add-comment">
            <label>Add New Comment:</label>
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button onClick={handleAddComment}>Submit</button>
          </div>
        </>
      )}
    </div>
  );
};

export default WorkoutDetails;
