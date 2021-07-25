import React, {ChangeEvent, KeyboardEvent, useState} from 'react'
import {TextField} from "@material-ui/core";


export type PropsType = {
    value: string
    onChange: (newValue: string) => void
    disabled?: boolean
    fontSize?: string
}

export const EditableSpan = React.memo(({value, onChange, disabled = false, fontSize}: PropsType) => {
    const [editMode, setEditMode] = React.useState(false)
    const [title, setTitle] = useState(value)

    const activateEditMode = () => {
        if(!disabled) {
            setEditMode(true)
            setTitle(value)
        }
    }
    const activateViewMode = () => {
        setEditMode(false)
        onChange(title)
    }
    const onChangeStatusHandler =(e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler =(e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setEditMode(false)
            onChange(title)
        }
    }

    return (
        editMode ?
            <TextField variant='outlined' value={title} onChange={onChangeStatusHandler} onKeyPress={onKeyPressHandler} autoFocus onBlur={activateViewMode}/>
            :
            <span style={{fontSize: fontSize}} onDoubleClick={activateEditMode}>{title}</span>
    )
})