import {asyncActions as appAsyncActions} from '../reducers/appReducer'
import {asyncActions as authAsyncActions} from '../reducers/authReducer'
import {asyncActions as taskAsyncActions} from '../reducers/tasksReducer'
import {asyncActions as todolistAsyncActions} from '../reducers/todolistReducer'

export default {
    ...appAsyncActions,
    ...authAsyncActions,
    ...taskAsyncActions,
    ...todolistAsyncActions
}