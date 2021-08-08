import React, {ChangeEvent, KeyboardEvent, useState} from 'react'
import {TextField} from "@material-ui/core";


export type PropsType = {
    value: string
    onChange: (newValue: string) => void
    disabled?: boolean
    fontSize?: string
    fontWeight?: "normal" | "inherit" | "-moz-initial" | "initial" | "revert" | "unset" | "bold" | (number & {}) | "bolder" | "lighter" | undefined
}

export const EditableSpan = React.memo(({value, onChange, disabled = false, fontSize, fontWeight}: PropsType) => {
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
            <TextField variant='outlined' value={title}
                       onChange={onChangeStatusHandler}
                       onKeyPress={onKeyPressHandler}
                       onBlur={activateViewMode}
                       autoFocus />
            :
            <span style={{fontSize: fontSize, fontWeight: fontWeight}} onDoubleClick={activateEditMode}>{title}</span>
    )
})