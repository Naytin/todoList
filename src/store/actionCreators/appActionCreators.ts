import {createAction} from "@reduxjs/toolkit";

export const setAppStatus = createAction<{ status: RequestStatusType }>('app/setAppStatus')
export const setAppError = createAction<{ error: string | null }>('app/setAppError')

// types
export type RequestStatusType = 'idle' | 'loading' | 'succeeded' | 'failed'

