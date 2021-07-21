import {Dispatch} from "redux";
import {authAPI} from "../api/API";
import {setIsLoggedIn} from "../features/Auth/authReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {setIsInitialized} from "./appReducer";

export const initializeAppTC = () => (dispatch: Dispatch) => {
    authAPI.auth()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedIn({value: true}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
            dispatch(setIsInitialized({value: true}))
        }).catch(error => {
        handleServerNetworkError(error, dispatch)
    })
}
