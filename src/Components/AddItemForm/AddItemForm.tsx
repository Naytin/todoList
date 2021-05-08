import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

export type PropsType = {
    addItem: (title: string) => void
    disabled?: boolean
}

export const AddItemForm = React.memo(({addItem, disabled = false}: PropsType) => {
    let [error, setError] = useState<string | null>(null)
    let [title, setTitle] = useState("")

    const addItemHandler = () => {
        if (title.trim() !== "") {
            addItem(title.trim());
            setTitle("");
        } else {
            setError("Title is required");
        }
    }
    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if(error !== null) {
            setError(null);
        }
        if (e.key === 'Enter') {
            addItemHandler();
        }
    }

    return <div>
        <TextField value={title}
                   disabled={disabled}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   error={!!error}
                   label={title}
                   helperText={error}
                   variant='outlined'
                   className=''
        />
        <IconButton size='small' color='primary' onClick={addItemHandler} disabled={disabled}>
            <AddBox/>
        </IconButton>
    </div>
})