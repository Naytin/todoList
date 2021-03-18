import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react'
import {TextField} from "@material-ui/core";


type PropsType = {
    value: string
    onChange: (newValue: string) => void
}

export const EditableSpan = React.memo((props: PropsType) => {
    console.log('EditableSpan was called')
    const [editMode, setEditMode] = React.useState(false)
    const [title, setTitle] = useState(props.value)

    const activateEditMode = useCallback(() => {
        setEditMode(true)
        setTitle(props.value)
    },[])
    const activateViewMode = useCallback(() => {
        setEditMode(false)
        props.onChange(title)
    },[])
    const onChangeStatusHandler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    },[])
    const onKeyPressHandler = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setEditMode(false)
            props.onChange(title)
        }
    },[])

    return (
        editMode ?
            <TextField variant='outlined' value={title} onChange={onChangeStatusHandler} onKeyPress={onKeyPressHandler} autoFocus onBlur={activateViewMode}/>
            :
            <span onDoubleClick={activateEditMode}>{title}</span>
    )
})