import {bindActionCreators} from "redux";
import {useAppDispatch} from "../app/store";
import ActionCreators from '../features/index'
import {useMemo} from "react";

export const useActions = () => {
    const dispatch = useAppDispatch()

    return useMemo(() => {
        return bindActionCreators(ActionCreators,dispatch)
    },[])
}
