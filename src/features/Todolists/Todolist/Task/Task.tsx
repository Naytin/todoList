import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../../../Components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "../../../../api/API";
import {useActions} from "../../../../hooks/useActions";
import style from './Task.module.scss'

export type PropsType = {
    task: TaskType
    todolistId: string
}

const Task = React.memo(({todolistId, task}: PropsType) => {
    const {removeTaskTC, updateTask} = useActions()

    const removeTask = useCallback(() => {
       removeTaskTC(task.id, todolistId)
    },[task.id,todolistId])

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        updateTask(task.id,  todolistId, {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New});
    },[task.id,todolistId])

    const changeTaskTitle = useCallback((title: string) => {
        updateTask(task.id, todolistId, {title});
    },[task.id,todolistId])

    const statusLoading = task.entityStatus === 'loading'
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