import { useState } from "react";
import axios from "axios";
import {useAuthContext} from './useAuthContext'

export const useSignup = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const {dispatch} = useAuthContext()

    const signup = async (email, password) => {
        setIsLoading(true) // disbale button to stop extra requests
        setError(null) // to ensure there is no error in the state

        //API CALL
        try {
            const response = await axios.post('http://localhost:4000/api/user/signup', 
                {email, password},
                {headers: {
                        'Content-Type': 'application/json'
                    }
                }
            ) // end of the url

            //handle if the response is not ok
            // backend - if a response is ok the status has a code of 200
            if (response.status !== 200) {
                setIsLoading(false)
                setError(error.response.data.error)
            }

            // Handle if the response is ok
            // status = 200
            if (response.status === 200) {
                // save user local storage
                localStorage.setItem('user', JSON.stringify(response.data))

                // update the auth context - say user is signed in
                // disptach with the relevant type - 'LOGIN'
                dispatch({type: 'LOGIN', payload: response.data})

                // reenable the button
                setIsLoading(false)
            }



        } catch (error) {
            console.error(error.response.data.error)
            //Update the error state
            setError(error.response.data.error)
            setIsLoading(false)
        }
    } // end of signup 

    return {signup, isLoading, error} // sign up function, isLoading state, error state
}