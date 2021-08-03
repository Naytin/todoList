import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../../../Components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "../../../../api/API";
import style from './Task.module.scss'
import {useActions} from "../../../../hooks/useActions";
import {taskAsyncActions} from "../../../../store/actionCreators";

export type PropsType = {
    task: TaskType
    todolistId: string
    status:  string
}

const Task = React.memo(({todolistId, task, status,}: PropsType) => {
    const {removeTask, updateTask} = useActions(taskAsyncActions)

    const removeTaskHandler = useCallback(() => {
        removeTask({taskId: task.id, todolistId})
    },[task.id,todolistId])

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        updateTask({taskId: task.id, todolistId, domainModel: {status}});
    },[task.id,todolistId])

    const changeTaskTitle = useCallback((title: string) => {
        updateTask({taskId: task.id, todolistId, domainModel: {title}});
    },[task.id,todolistId])

    const statusLoading = status === 'loading'

    return (
        <div className={task.status === TaskStatuses.Completed ?
            style.task__wrapper + ' ' + style.is_done: style.task__wrapper}>
            <div className={style.content}>
                <Checkbox color='primary'
                          onChange={onChangeHandler}
                          checked={task.status === TaskStatuses.Completed}
                          disabled={statusLoading}/>
                <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={statusLoading}/>
            </div>
            <IconButton onClick={removeTaskHandler} disabled={statusLoading}>
                <Delete/>
            </IconButton>
        </div>
    )
})

export default Task