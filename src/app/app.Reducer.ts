const initialState = {
    status: 'succeeded' as RequestStatusType,
    error: null as ErrorMessageType
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
        default:
            return state
    }
}

// actions
export const setAppStatusAC = (status: RequestStatusType) => ({type: 'APP/SET-STATUS', status} as const)
export const setAppErrorAC = (error: string | null) => ({type: 'APP/SET-ERROR', error} as const)


// types

export  type ErrorMessageType = string | null
export type AppStateType = typeof initialState
export type SetErrorActionType = ReturnType<typeof setAppErrorAC>;
export type SetStatusActionType = ReturnType<typeof setAppStatusAC>;
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'
type ActionsType = SetErrorActionType | SetStatusActionType