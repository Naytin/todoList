import React, {ChangeEvent, useCallback, useEffect, useState} from 'react'
import {EditableSpan} from "../../../../Components/EditableSpan/EditableSpan";
import {TaskStatuses, TaskType} from "../../../../api/types";
import style from './Task.module.scss'
import {useActions} from "../../../../utils/hooks/useActions";
import {taskAsyncActions} from "../../../../store/actionCreators";
import {icons} from "../../../../assets/icons";

export type PropsType = {
    task: TaskType
    todolistId: string
    status: string
}

const Task = React.memo(({todolistId, task, status,}: PropsType) => {
    const {removeTask, updateTask} = useActions(taskAsyncActions)
    const [checked, setChecked] = useState<boolean>(Boolean(task.status))


    useEffect(() => {
        setChecked(Boolean(task.status))
    }, [task.status])

    const removeTaskHandler = useCallback(() => {
        removeTask({taskId: task.id, todolistId})
    }, [task.id, todolistId])

    const onChangeHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        let status = e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New

        updateTask({taskId: task.id, todolistId, domainModel: {status}});
    }, [task.id, todolistId])

    const changeTaskTitle = useCallback((title: string) => {
        updateTask({taskId: task.id, todolistId, domainModel: {title}});
    }, [task.id, todolistId])

    const statusLoading = status === 'loading'

    return (
        <div>
            <div
                className={`flex items-center ${style.task} ${checked && 'opacity-40'} 
            cursor-pointer border-2 shadow-md rounded-sm p-2 my-2`}>
                <div className='w-full flex items-center'>
                    <div className='flex items-center'>
                        <input type="checkbox"
                               onChange={onChangeHandler}
                               checked={task.status === TaskStatuses.Completed}
                               disabled={statusLoading}
                               className='w-4 h-4'/>
                    </div>
                    <div className='break-all ml-2 '>
                        <EditableSpan value={task.title} onChange={changeTaskTitle} disabled={statusLoading}/>
                    </div>
                </div>
                <div className='flex flex-col items-center justify-between'>
                    <button className='flex' onClick={removeTaskHandler} disabled={statusLoading}>
                        <span>{icons.trash}</span>
                    </button>
                </div>
            </div>
        </div>
    )
})

export default Task

