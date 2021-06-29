import {authAPI} from "../api/API";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import { setIsLoggedIn} from "../features/Login/authReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: InitialStateType = {
    status: 'idle',
    error: null,
    isInitialized: false
}

const slice = createSlice({
    name: 'APP',
    initialState: initialState,
    reducers: {
        setAppStatusAC(state, action: PayloadAction<{status: RequestStatusType}>) {
            state.status = action.payload.status
        },
        setAppErrorAC(state, action: PayloadAction<{error: string | null}>) {
            state.error = action.payload.error
        },
        setIsInitialized(state, action: PayloadAction<{value: boolean}>) {
            state.isInitialized = action.payload.value
        }
    }
})


export const appReducer = slice.reducer
export const {setAppStatusAC,setAppErrorAC,setIsInitialized} = slice.actions

// export const appReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch (action.type) {
//         case 'APP/SET-STATUS':
//             return {
//                 ...state,
//                 status: action.status
//             }
//         case 'APP/SET-ERROR':
//             return {...state, error: action.error}
//         case 'APP/IS_INITIALIZED':
//             return {...state, isInitialized: action.value}
//         default:
//             return state
//     }
// }
//
// // actions
// export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
// export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)
// export const setIsInitialized = (value: boolean) => ({type: 'APP/IS_INITIALIZED', value} as const)

export const initializeAppTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC({status: 'loading'}))
    authAPI.auth()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsInitialized({value: true}))
                dispatch(setIsLoggedIn({value: true}))
                dispatch(setAppStatusAC({status: 'succeeded'}))
            } else {
                handleServerAppError(res.data, dispatch)
            }

        }).catch(error => {
        handleServerNetworkError(error, dispatch)
    })
}


// types

export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
export type InitialStateType = {
    // происходит ли сейчас взаимодействие с сервером
    status: RequestStatusType
    // если ошибка какая-то глобальная произойдёт - мы запишем текст ошибки сюда
    error: string | null
    isInitialized: boolean
}

export type ErrorMessageType = string | null
// export type SetErrorActionType = ReturnType<typeof setAppErrorAC>;
// export type SetStatusActionType = ReturnType<typeof setAppStatusAC>;
// export type SetInitializedType = ReturnType<typeof setIsInitialized>;

