import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../../../Components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "../../../../api/API";
import {useActions} from "../../../../hooks/useActions";

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
        let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New
        updateTask(task.id,  todolistId, {status});
    },[task.id,todolistId])

    const changeTaskTitle = useCallback((title: string) => {
        updateTask(task.id, todolistId, {title});
    },[task.id,todolistId])

    const statusLoading = task.entityStatus === 'loading'
    return (
        <div className={task.status === TaskStatuses.Completed ? "task__wrapper is-done" : "task__wrapper"}>
            <Checkbox color='primary'
                      onChange={onChangeHandler}
                      checked={task.status === TaskStatuses.Completed}
                      disabled={statusLoading}/>
            <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={statusLoading}/>
            <IconButton onClick={removeTask} disabled={statusLoading}>
                <Delete/>
            </IconButton>
        </div>
    )
})

export default Task