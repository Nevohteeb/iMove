import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { WorkoutsContextProvider } from './context/WorkoutContext.jsx';
import { AuthContextProvider } from './context/AuthContext.jsx';
import { AddFormContextProvider } from './context/AddFormContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
      <WorkoutsContextProvider>
        <AddFormContextProvider>
          <App />
        </AddFormContextProvider>
      </WorkoutsContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
