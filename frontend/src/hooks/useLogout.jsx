import { useAuthContext } from "./useAuthContext"

export const useLogout = () => {
    const {dispatch} = useAuthContext() // bring in dispatch to change auth context
    
    const logout = () => {
        // Way #1 - clear local
        // localStorage.clear()

        // Way #2 - remove the specific item for local storage
        localStorage.removeItem('user')

        // update the auth context - clear out
        dispatch({type: 'LOGOUT'})
    }

    return {logout}
}