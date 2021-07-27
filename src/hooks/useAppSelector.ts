import {TypedUseSelectorHook, useSelector} from "react-redux";
import {AppRootStateType} from "../store/store";

// create a hook, that works with a typed useSelector
// use TypedUseSelectorHook - Pass state types to useSelector
export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
