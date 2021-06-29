import { Dispatch } from 'redux'
import {setAppStatusAC} from '../../app/appReducer'
import {authAPI, ParamsLoginType} from "../../api/API";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: 'AUTH', // name of our reducer
    initialState: initialState, // initialState
    reducers: {
        // Transfer to reducer our actions and put state and action to the parameters
        // we need types actions and and use PayloadAction< {our value: type} >
        setIsLoggedIn(state, action :PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    }
})
export const authReducer = slice.reducer // assign our reducer to variable
export const {setIsLoggedIn} = slice.actions // get actionCreator from actions

// type InitialStateType = typeof initialState

// export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
//     switch(action.type) {
//         case 'login/SET_IS_LOGGED_IN':
//             return {...state, isLoggedIn: action.value}
//         default:
//             return state
//     }
// }
//
// export const setIsLoggedIn = (value: boolean) => ({type: 'login/SET_IS_LOGGED_IN', value} as const)

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
//
// export type SetIsLoggedInType = ReturnType<typeof setIsLoggedIn>

// type ThunkType = Dispatch<ActionsType | SetStatusActionType | SetErrorActionType>
// type ActionsType = SetIsLoggedInType | SetErrorActionType | SetStatusActionType