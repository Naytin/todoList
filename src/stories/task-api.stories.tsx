import React, {useEffect, useState} from 'react'
import {tasksAPI} from "../api/task-api";

export default {
    title: 'API-TASK'
}

export const GetTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        // здесь мы будем делать запрос и ответ закидывать в стейт.
        // который в виде строки будем отображать в div-ке
        const todolistId = '11ccbb75-dc9b-4bbf-8cdd-e0431dea9398';
        tasksAPI.getTasks(todolistId)
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)

    const todolistId = '11ccbb75-dc9b-4bbf-8cdd-e0431dea9398';
    useEffect(() => {
        tasksAPI.createTask(todolistId,'NEW APAPAPAPA')
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '11ccbb75-dc9b-4bbf-8cdd-e0431dea9398';
        const taskId = '35db1bde-b781-43ca-a4a6-afa03884c70a';
        tasksAPI.deleteTask(todolistId, taskId)
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = '11ccbb75-dc9b-4bbf-8cdd-e0431dea9398'
        const taskId = '35db1bde-b781-43ca-a4a6-afa03884c70a';
        tasksAPI.updateTask(todolistId,taskId, {title: '',
            description: 'string',
            status: 1,
            priority: -2,
            startDate:  '',
            deadline: ''})
            .then((res) => {
                setState(res.data)
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
