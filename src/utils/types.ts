import {rootReducer} from "../store/store";
import {FieldError} from "../api/types";

// automatically determine the type of the entire state of the object
export type AppRootStateType = ReturnType<typeof rootReducer>

export type ThunkError = {rejectValue: {errors: Array<string>, fieldsErrors? : Array<FieldError>}}