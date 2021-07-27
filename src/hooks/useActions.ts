import {bindActionCreators} from "redux";
import {useAppDispatch} from "../store/store";
import ActionCreators from '../store/actionCreators'

// создаем hook, который связывает все actions creators с диспатчем
// нам больше не понядобиться использование диспатча в комоненте, просто будем вызывать функцию
export const useActions = () => {
    const dispatch = useAppDispatch()
    return bindActionCreators(ActionCreators,dispatch)
}