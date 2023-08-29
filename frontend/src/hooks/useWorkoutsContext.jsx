import { WorkoutsContext } from "../context/WorkoutContext";
import { useContext } from "react";

export const useWorkoutsContext = () => {
    const context = useContext(WorkoutsContext)

    // error check - check that context is available
    // ie: are you using it inside of the Context.Provider component
    if (!context) {
        throw Error('useWorkoutsContext must be used inside of WorkoutsContextProvider')
    }

    return context
}