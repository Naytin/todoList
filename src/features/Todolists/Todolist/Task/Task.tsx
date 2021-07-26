import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../../../Components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import { removeTaskTC, updateTask} from "../../tasksReducer";
import {TaskStatuses, TaskType} from "../../../../api/API";
import style from './Task.module.scss'

export type PropsType = {
    task: TaskType
    todolistId: string
    status:  string
}

const Task = React.memo(({todolistId, task, status}: PropsType) => {
    const dispatch = useDispatch()

    const removeTask = useCallback(() => {
        dispatch(removeTaskTC({taskId: task.id, todolistId}))
    },[task.id,todolistId])

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        dispatch(updateTask({taskId: task.id, todolistId, domainModel: {status}}));
    },[task.id,todolistId])

    const changeTaskTitle = useCallback((title: string) => {
        dispatch(updateTask({taskId: task.id, todolistId, domainModel: {title}}));
    },[task.id,todolistId])

    const statusLoading = status === 'loading'
    return (
        <div className={task.status === TaskStatuses.Completed ? style.task__wrapper + ' ' + style.is_done: style.task__wrapper}>
            <div className={style.content}>
                <Checkbox color='primary'
                          onChange={onChangeHandler}
                          checked={task.status === TaskStatuses.Completed}
                          disabled={statusLoading}/>
                <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={statusLoading}/>
            </div>
            <IconButton onClick={removeTask} disabled={statusLoading}>
                <Delete/>
            </IconButton>
        </div>
    )
})

export default Task