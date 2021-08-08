import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {IconButton, makeStyles, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

export type PropsType = {
    addItem: (title: string) => Promise<any>
    disabled?: boolean
}

export const AddItemForm = React.memo(({addItem, disabled = false}: PropsType) => {
    let [error, setError] = useState<string | null>(null)
    let [title, setTitle] = useState("")

    const styles = useStyles()

    const addItemHandler = async () => {
        if (title.trim() !== "") {
            try {
                await addItem(title.trim());
                setTitle("");
            }catch (e) {
                setError(e.message);
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

    return (
    <div className={styles.container}>
        <TextField value={title}
                   disabled={disabled}
                   onChange={onChangeHandler}
                   onKeyPress={onKeyPressHandler}
                   error={!!error}
                   helperText={error}
                   variant='outlined'
                   className=''
        />
        <IconButton onClick={addItemHandler} disabled={disabled}>
            <AddBox />
        </IconButton>
    </div>)
})

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },
}));