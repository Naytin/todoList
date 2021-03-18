import React, {ChangeEvent, KeyboardEvent, useCallback, useState} from "react";
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

type PropsType = {
    addItem: (title: string) => void
}

export const AddItemForm = React.memo((props: PropsType) => {
    console.log('AddItemForm called')
    let [error, setError] = useState<string | null>(null)
    let [title, setTitle] = useState("")

    const addItem = () => {
        if (title.trim() !== "") {
            props.addItem(title.trim());
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
            addItem();
        }
    }

    return <div>
        <TextField value={title}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   error={!!error}
                   label={title}
                   helperText={error}
                   variant='outlined'
                   className=''
        />
        <IconButton size='small' color='primary' onClick={addItem}>
            <AddBox/>
        </IconButton>
    </div>
})