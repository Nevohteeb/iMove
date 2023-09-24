import { AddFormContext } from "../context/AddFormContext";
import { useContext } from "react";

// custom hook
export const useAddFormContext = () => {
    const context = useContext(AddFormContext)

    // error check - make sure context is available to us
    // is making sure you are using the AuthContext inside of AuthContext.Provider
    if (!context) {
        throw Error("useAddFormContext must be used inside of AddFormContextProvider")
    }

    return context
}