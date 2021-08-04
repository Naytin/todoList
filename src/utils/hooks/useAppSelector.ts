import {TypedUseSelectorHook, useSelector} from "react-redux";
import {AppRootStateType} from "../types";


// create a hook, that works with a typed useSelector
// use TypedUseSelectorHook - Pass state types to useSelector
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
