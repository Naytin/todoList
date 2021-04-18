import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import { removeTaskTC, updateTaskStatusTC, updateTaskTitleTC} from "../state/tasksReducer";
import {TaskStatuses, TaskType} from "../api/task-api";

export type PropsType = {
    task: TaskType
    todolistId: string
}

const Task = React.memo(({todolistId, task}: PropsType) => {
    const dispatch = useDispatch()

    const removeTask = useCallback(() => {
        dispatch(removeTaskTC(task.id, todolistId))
    },[task.id,todolistId])
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        dispatch(updateTaskStatusTC(task.id,  todolistId,newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New));
    },[task.id,todolistId])
    const changeTaskTitle = useCallback((newTitle: string) => {
        dispatch(updateTaskTitleTC(task.id, newTitle, todolistId));
    },[task.id,todolistId])


    return (
        <div className={task.status === TaskStatuses.Completed ? "task__wrapper is-done" : "task__wrapper"}>
            <Checkbox color='primary'  onChange={onChangeHandler} checked={task.status === TaskStatuses.Completed}/>
            <EditableSpan value={task.title} onChange={changeTaskTitle}/>
            <IconButton onClick={removeTask}><Delete/></IconButton>
        </div>
    )
})

export default Task