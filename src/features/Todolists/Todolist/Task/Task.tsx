import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../../../Components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import { removeTaskTC, updateTask} from "../../tasksReducer";
import {TaskStatuses, TaskType} from "../../../../api/task-api";

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
        let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTask(task.id,  todolistId, {status}));
    },[task.id,todolistId])
    const changeTaskTitle = useCallback((title: string) => {
        dispatch(updateTask(task.id, todolistId, {title}));
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