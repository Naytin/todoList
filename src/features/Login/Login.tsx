import React from 'react'
import {
    Button,
    Checkbox,
    createStyles,
    FormControl,
    FormControlLabel,
    FormGroup,
    Grid,
    makeStyles,
    TextField
} from '@material-ui/core'
import {FormikHelpers, useFormik} from 'formik';
import {Redirect} from 'react-router-dom';
import {useAppSelector} from "../../utils/hooks/useAppSelector";
import {authAsyncActions} from "../../store/actionCreators";
import {useAppDispatch} from "../../utils/hooks/useActions";
import s from './Login.module.scss'


type FormikValueType = {
    email: string
    password: string
    rememberMe: boolean
}

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            '& .MuiOutlinedInput-root': {
                borderRadius: '10px'
            },
            '& .MuiOutlinedInput-input': {
                padding: '10px',

            },
            '& .MuiInputLabel-formControl': {
                top: '-7px',
            },
            textAlign: 'center',
            marginTop: '50px'
        }
    })
)

export const Login = () => {
    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)
    const dispatch = useAppDispatch()
    const {login} = authAsyncActions

    const classes = useStyles()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false
        },
        validate: (values) => {
            const errors: FormikValueType = {} as FormikValueType;
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }
            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length < 3) {
                errors.password = 'password must be more than 3 character';
            }
            return errors;
        },
        onSubmit: async (values: FormikValueType, formikHelpers: FormikHelpers<FormikValueType>) => {
            let action = await dispatch(login(values));
            debugger
            if (login.rejected.match(action)) {
                if (action.payload?.fieldsErrors?.length) {
                    const error = action.payload?.fieldsErrors[0]
                    formikHelpers.setFieldError(error.field, error.error)
                }else {
                    const error = action.payload?.errors[0]
                    if(error) {
                        formikHelpers.setFieldError(error, error)
                    }
                }
            }
        },
    });
    if (isLoggedIn) {
        return <Redirect to={'/'}/>
    }

    return <Grid container
                 justify="center">
        <Grid item xs={10}>
            <form onSubmit={formik.handleSubmit} className={classes.root} >
                <FormControl className={s.login_form}>
                    <div className={s.information}>
                        <p>To log in get registered
                            <a href={'https://social-network.samuraijs.com/'}
                               target={'_blank'}
                               rel='noreferrer'>here
                            </a>
                        </p>
                        <p>or use test account credentials:</p>
                        <p>Email: nikitinasv12@gmail.com</p>
                        <p>Password: 123456</p>
                    </div>
                    <FormGroup>
                        <TextField
                            variant='outlined'
                            label="Email"
                            margin="normal"
                            {...formik.getFieldProps('email')}
                        />
                        {formik.touched.email && formik.errors.email ?
                            <div style={{color: 'red'}}>{formik.errors.email}</div> : null}
                        <TextField
                            variant='outlined'
                            type='password'
                            label="Password"
                            margin="normal"
                            {...formik.getFieldProps('password')}
                        />
                        {formik.touched.password && formik.errors.password ?
                            <div style={{color: 'red'}}>{formik.errors.password}</div> : null}
                        <FormControlLabel
                            label={'Remember me'}
                            control={<Checkbox
                                color='primary'
                                {...formik.getFieldProps('rememberMe')}
                            />}
                        />
                        <Button type={'submit'}
                                variant={'contained'}
                                className={s.login_button}>Sign in</Button>
                    </FormGroup>
                </FormControl>
            </form>
        </Grid>
    </Grid>
}
