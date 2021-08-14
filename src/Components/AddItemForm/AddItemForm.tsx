import React, {ChangeEvent, KeyboardEvent, ReactNode, useEffect, useState} from "react";

export type PropsType = {
    addItem: (title: string) => Promise<any>
    disabled?: boolean
    placeholder?: string
    icon?: ReactNode
}

export const AddItemForm = React.memo(({addItem, disabled = false, placeholder, icon}: PropsType) => {
    let [error, setError] = useState<string | null>(null)
    let [title, setTitle] = useState("")


    useEffect(() => {
        let timeoutId: number;
        if(error) {
            timeoutId = setTimeout(setError,3000,null)
        }
        return () => clearTimeout(timeoutId)
    },[error])

    const addItemHandler = async () => {
        if (title.trim() !== "") {
            try {
                await addItem(title.trim());
                setTitle("");
            } catch (e) {
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
        if (error !== null) {
            setError(null);
        }
        if (e.key === 'Enter') {
            addItemHandler();
        }
    }

    return (
        <div className='flex justify-center'>
            <div className="text-gray-400 relative flex items-center relative">
                <button onClick={addItemHandler}
                        disabled={disabled}
                        className='absolute p-2'>
                    {icon}
                </button>
                <input
                    value={title}
                    className={`border-2 ${error && 'border-red-500'} bg-white shadow-md rounded-md pl-16 pr-6 py-2 my-2 w-64`}
                    type="text"
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={onChangeHandler}
                    onKeyPress={onKeyPressHandler}
                />
                {error ? <div className='absolute -top-6 -right-4 p-1 border text-red-500 bg-gray-400 bg-opacity-10 rounded-md'>{error}</div> : null}
            </div>
        </div>
    )
})