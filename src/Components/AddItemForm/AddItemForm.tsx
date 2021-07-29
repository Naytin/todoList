import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

export type PropsType = {
    addItem: (title: string) => Promise<any>
    disabled?: boolean
}

export const AddItemForm = React.memo(({addItem, disabled = false}: PropsType) => {
    let [error, setError] = useState<string | null>(null)
    let [title, setTitle] = useState("")

    const addItemHandler = async () => {
        if (title.trim() !== "") {
            try {
                await addItem(title.trim());
                setTitle("");
            }catch (e) {
                setError(e);
            }
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
                   helperText={error}
                   variant='outlined'
                   className=''
        />
        <IconButton size='small' color='primary' onClick={addItemHandler} disabled={disabled}>
            <AddBox/>
        </IconButton>
    </div>
})