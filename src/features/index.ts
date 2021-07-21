import * as AuthActionCreators from '../features/Auth/authActionCreators'
import * as TodoActionCreators from '../features/Todolists/actionCreators/todolistActionCreators'
import * as TaskActionCreators from '../features/Todolists/actionCreators/taskActionCreators'
import * as AppActionCreators from '../app/appActionCreators'

export default  {
    ...AuthActionCreators,
    ...TodoActionCreators,
    ...TaskActionCreators,
    ...AppActionCreators
}