import React, {useState} from 'react'
import {FormikHelpers, useFormik} from 'formik';
import {Redirect} from 'react-router-dom';
import {useAppSelector} from "../../utils/hooks/useAppSelector";
import {authAsyncActions} from "../../store/actionCreators";
import {useAppDispatch} from "../../utils/hooks/useActions";
import {InfoBox} from "./InfoBox";
import {icons} from "../../assets/icons";


type FormikValueType = {
    email: string
    password: string
    rememberMe: boolean
}


export const Login = () => {
    const [show, setShow] = useState<boolean>(false)

    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()
    const {login} = authAsyncActions

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikValueType = {} as FormikValueType;
            if (!values.email) {
                errors.email = 'email is required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if (!values.password) {
                errors.password = 'password is required';
            } else if (values.password.length < 6) {
                errors.password = 'password must be more than 6 character';
            }
            return errors;
        },
        onSubmit: async (values: FormikValueType, formikHelpers: FormikHelpers<FormikValueType>) => {
            let action = await dispatch(login(values));

            if (login.rejected.match(action)) {
                if (action.payload?.fieldsErrors?.length) {
                    const error = action.payload?.fieldsErrors[0]
                    formikHelpers.setFieldError(error.field, error.error)
                } else {
                    const error = action.payload?.errors[0]
                    if (error) {
                        formikHelpers.setFieldError(error, error)
                    }
                }
            }
        },
    });
    const showHandle = () => {
        setShow(state => !state)
    }

    if (isLoggedIn) {
        return <Redirect to={'/'}/>
    }

    return (
        <div className='flex justify-center items-center mt-8'>
            <div className='w-11/12 sm:w-96 p-8 rounded-md bg-blue-200 flex flex-col items-center justify-center
            shadow-2xl relative'>
                <InfoBox/>
                <h3 className='font-medium text-white text-2xl my-4'>Sign in</h3>
                <form onSubmit={formik.handleSubmit} className="flex flex-col -m-2 w-full">
                    <div className="text-gray-400 focus-within:text-gray-600 relative flex items-center relative">
                        <div className='absolute p-3'>
                            {icons.email}
                        </div>
                        <input
                            className="border-2 shadow-lg rounded-xl px-10 py-2 my-5 w-full"
                            type="text"
                            placeholder="Email"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email ?
                            <div className='absolute -top-2 -right-4 p-1 border text-red-500 bg-gray-400
                            bg-opacity-10 rounded-md'>{formik.errors.email}</div> : null}
                    </div>
                    <div className="text-gray-400 focus-within:text-gray-600 relative flex items-center">
                        <div onClick={showHandle} className='absolute p-3'>
                            {!show ? icons.lock : icons.unlock}
                        </div>
                        <input
                            className="border-2 shadow-lg rounded-xl  px-10 my-5 py-2  w-full"
                            type={show ? "text" : "password"}
                            placeholder="Password"
                            {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password ?
                            <div className='absolute -top-2 -right-4 p-1 border text-red-500 bg-gray-400
                            bg-opacity-20 rounded-md'>{formik.errors.password}</div> : null}
                    </div>
                    <div className='flex items-center justify-between mt-6 relative'>
                        <div className='flex items-center'>
                            <input id='remember' className="w-5 h-5 checked:border-transparent"
                                   type="checkbox"
                                   {...formik.getFieldProps('rememberMe')}
                            />
                            <label htmlFor="remember" className='ml-2 font-medium text-xs sm:text-base text-white'>Remember me</label>
                        </div>
                        <button className='text-xs sm:text-base'>Forgot password?</button>
                    </div>
                    <button className="font-bold hover:text-white shadow-lg w-full mb-5 mt-12 py-2 px-5 bg-yellow-300
                    hover:bg-yellow-400 border rounded-md transition duration-500
                    ease-in-out">Sign in
                    </button>
                    <div className='flex justify-center items-center'>
                        <p className='text-xs sm:text-base'>Don't have an account?</p>
                        <button className='ml-2  text-xs sm:text-base font-medium text-white'>Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

