import {authAPI} from "../api/API";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";

const initialState = {
    status: 'succeeded' as RequestStatusType,
    error: null as ErrorMessageType,
    isInitialized: false
}


export const appReducer = (state: AppStateType = initialState, action: ActionsType): AppStateType => {
    switch (action.type) {
        case 'APP/SET-STATUS':
            return {
                ...state,
                status: action.status
            }
        case 'APP/SET-ERROR':
            return {...state, error: action.error}
        case 'APP/IS_INITIALIZED':
            return {...state, isInitialized: action.value}
        default:
            return state
    }
}

// actions
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
export const setIsLoggedInAC = (value: boolean) => ({type: 'APP/IS_INITIALIZED', value} as const)

export const initializeAppTC = () => (dispatch: ThunkType) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.auth()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setAppStatusAC('succeeded'))
                dispatch(setIsLoggedInAC(true))
            } else {
                handleServerAppError(res.data, dispatch)
            }

        }).catch(error => {
        handleServerNetworkError(error, dispatch)
    })
}


// types

export type ErrorMessageType = string | null
export type AppStateType = typeof initialState
export type SetErrorActionType = ReturnType<typeof setAppErrorAC>;
export type SetStatusActionType = ReturnType<typeof setAppStatusAC>;
export type SetInitializedType = ReturnType<typeof setIsLoggedInAC>;
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type ActionsType = SetErrorActionType | SetStatusActionType | SetInitializedType
type ThunkType = Dispatch<ActionsType | SetStatusActionType | SetErrorActionType>