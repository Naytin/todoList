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
        const todolistId = '01e4e3f5-0973-4933-aaf5-b7e6bdfe8252';
        tasksAPI.getTasks(todolistId)
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)

    const todolistId = '01e4e3f5-0973-4933-aaf5-b7e6bdfe8252';
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
        const todolistId = 'bef77474-c58f-4e9a-b67b-8afeab8bc9b3';
        const taskId = '45edaee4-afd8-4c3e-beae-8813a5bc36fa';
        tasksAPI.deleteTask(taskId,todolistId)
            .then((res) => {
                setState(res.data);
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todolistId = 'bef77474-c58f-4e9a-b67b-8afeab8bc9b3'
        const taskId = '5c23eef3-4a49-4418-a1c4-cd94075912f9';
        tasksAPI.updateTask(todolistId,taskId, {title: 'TASK',
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
