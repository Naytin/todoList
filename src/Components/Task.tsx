import React, {ChangeEvent, useCallback} from 'react'
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {useDispatch} from "react-redux";
import {TaskType} from "../TodoList";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC} from "../state/tasksReducer";

type PropsType = {
    task: TaskType
    todolistId: string
}


const Task = React.memo(({todolistId, task}: PropsType) => {
    console.log('task was called')
    const dispatch = useDispatch()

    const removeTask = useCallback(() => {
        dispatch(removeTaskAC(task.id, todolistId))
    },[task.id,todolistId])
    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        dispatch(changeTaskStatusAC(task.id, e.currentTarget.checked, todolistId));
    },[task.id,todolistId])
    const changeTaskTitle = useCallback((newTitle: string) => {
        dispatch(changeTaskTitleAC(task.id, newTitle, todolistId));
    },[task.id,todolistId])


    return (
        <div className={task.isDone ? "task__wrapper is-done" : "task__wrapper"}>
            <Checkbox color='primary'  onChange={onChangeHandler} checked={task.isDone}/>
            <EditableSpan value={task.title} onChange={changeTaskTitle}/>
            <IconButton onClick={removeTask}><Delete/></IconButton>
        </div>
    )
})

export default Task