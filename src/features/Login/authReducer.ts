import { Dispatch } from 'redux'
import { SetErrorActionType, setAppStatusAC, SetStatusActionType } from '../../app/appReducer'
import {authAPI, ParamsLoginType} from "../../api/API";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState = {
    isLoggedIn: false
}

type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch(action.type) {
        case 'login/SET_IS_LOGGED_IN':
            return {...state, isLoggedIn: action.value}
        default:
            return state
    }
}

export const setIsLoggedIn = (value: boolean) => ({type: 'login/SET_IS_LOGGED_IN', value} as const)

export const loginTC = (data: ParamsLoginType) => (dispatch: ThunkType) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.login(data)
        .then(res => {
        if(res.data.resultCode === 0) {
            dispatch(setAppStatusAC('succeeded'))
            dispatch(setIsLoggedIn(true))
        } else {
            handleServerAppError(res.data, dispatch)
        }
    }).catch(err => {
        handleServerNetworkError(err, dispatch)
    })
}

export const logoutTC = () => (dispatch: ThunkType) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logout()
        .then(res => {
            if(res.data.resultCode === 0) {
                dispatch(setAppStatusAC('succeeded'))
                dispatch(setIsLoggedIn(false))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        }).catch(err => {
        handleServerNetworkError(err, dispatch)
    })
}

export type SetIsLoggedInType = ReturnType<typeof setIsLoggedIn>

type ThunkType = Dispatch<ActionsType | SetStatusActionType | SetErrorActionType>
type ActionsType = SetIsLoggedInType | SetErrorActionType | SetStatusActionType