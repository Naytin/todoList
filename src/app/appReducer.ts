import {authAPI} from "../api/API";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import { setIsLoggedIn} from "../features/Login/authReducer";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    status: 'idle',
    error: null as string | null,
    isInitialized: false
}

const slice = createSlice({
    name: 'app',
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

