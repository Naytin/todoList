import {ActionCreatorsMapObject, bindActionCreators} from "redux";
import {useAppDispatch} from "../store/store";
import {useMemo} from "react";

// создаем hook, который связывает все actions creators с диспатчем
// нам больше не понядобиться использование диспатча в комоненте, просто будем вызывать функцию


export const useActions = <T extends ActionCreatorsMapObject>(actions: T) => {
    const dispatch = useAppDispatch()

    return useMemo(() => {
        return bindActionCreators(actions,dispatch)
    },[])
}