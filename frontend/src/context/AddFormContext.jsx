import { createContext, useReducer} from "react";

export const AddFormContext = createContext()

const initialState = {
    isAddFormVisible: false,
};
  

export const addReducer = (state, action) => {
    switch (action.type) {
        case 'OPEN_ADD':
            return {
                ...state,
                isAddFormVisible: true,
              };
        case 'CLOSE_ADD':
            return {
                ...state,
                isAddFormVisible: false,
              };
        default:
            return state
    }
}

export const AddFormContextProvider = ({ children }) => {
    const [state, dispatchAdd] = useReducer(addReducer, initialState)

    // check state
    console.log("AuthContext State:", state);

    return (
        <AddFormContext.Provider value={{...state, dispatchAdd}}>
            {children}
        </AddFormContext.Provider>
    )
}