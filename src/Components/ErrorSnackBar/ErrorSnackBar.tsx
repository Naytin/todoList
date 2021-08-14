import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {setAppError} from '../../store/actionCreators/appActionCreators'
import {AppRootStateType} from "../../utils/types";


export default function ErrorSnackBar() {
    const error = useSelector<AppRootStateType, string | null>(state => state.app.error)
    const [closeError, setCloseError] = useState<boolean>(false)
    const dispatch = useDispatch()

    useEffect(() => {
        let timeId: NodeJS.Timeout
        if (error) {
            setCloseError(true)
            timeId = setTimeout(handleClose, 4000)
        }
        return () => {
            clearTimeout(timeId)
        }
    }, [error])

    function handleClose() {
        setCloseError(false)
        dispatch(setAppError({error: null}));
    };

    return (
        <>
            {closeError &&
            <div className='z-10 absolute bottom-8 inset-x-0 text-center h-12'>
                <Alert error={error} onClose={handleClose}/>
            </div>}
        </>
    );
}


type AlertPropsType = {
    error: string | null
    onClose: () => void
}
const Alert = ({error, onClose}: AlertPropsType) => {
    return (
        <span className='flex items-center bg-red-600 text-white p-2 m-auto max-w-max rounded-md'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-4 text-white" fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
            {error}
            <button onClick={onClose} className='ml-4'>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293
                              4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293
                              5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"/>
                    </svg>
            </button>
        </span>
    )
}
