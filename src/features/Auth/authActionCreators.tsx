import {authAPI, ParamsLoginType} from "../../api/API";
import {Dispatch} from "redux";
import {setAppStatusAC} from "../../app/appReducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {setIsLoggedIn} from "./authReducer";

export const loginTC = (data: ParamsLoginType) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.login(data)
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(setIsLoggedIn({value: true}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch(err => {
        handleServerNetworkError(err, dispatch)
    })
}
export const logoutTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.logout()
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(setAppStatusAC({status: 'succeeded'}))
                dispatch(setIsLoggedIn({value: false}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch(err => {
        handleServerNetworkError(err, dispatch)
    })
}

