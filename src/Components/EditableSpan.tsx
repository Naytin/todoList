import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from 'react'
import {TextField} from "@material-ui/core";


export type PropsType = {
    value: string
    onChange: (newValue: string) => void
}

export const EditableSpan = React.memo((props: PropsType) => {
    const [editMode, setEditMode] = React.useState(false)
    const [title, setTitle] = useState(props.value)

    const activateEditMode = () => {
        setEditMode(true)
        setTitle(props.value)
    }
    const activateViewMode = () => {
        setEditMode(false)
        props.onChange(title)
    }
    const onChangeStatusHandler =(e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler =(e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setEditMode(false)
            props.onChange(title)
        }
    }

    return (
        editMode ?
            <TextField variant='outlined' value={title} onChange={onChangeStatusHandler} onKeyPress={onKeyPressHandler} autoFocus onBlur={activateViewMode}/>
            :
            <span onDoubleClick={activateEditMode}>{title}</span>
    )
})