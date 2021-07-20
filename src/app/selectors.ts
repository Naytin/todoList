import {AppRootStateType} from "./store";

export const selectIsInitialized = (state: AppRootStateType): boolean => state.app.isInitialized
export const selectStatus = (state: AppRootStateType): string => state.app.status