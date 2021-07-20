import {AppRootStateType} from "../../../../app/store";
import {TaskStateType} from "../../tasksReducer";

export const selectorTasks = (state: AppRootStateType):TaskStateType => state.tasks