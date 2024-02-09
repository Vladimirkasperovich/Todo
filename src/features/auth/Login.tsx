import React from "react";
import {useFormik} from "formik";
import {useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import {Button, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, TextField} from "@mui/material";
import {login} from "features/auth/auth.reducer";
import {useAppDispatch} from "common/hooks";
import {selectIsLoggedIn} from "features/auth/auth.selectors";
import s from "./Login.module.css";
import {BaseResponseType} from "../../common/types";
type FormikErrorType = {
    email?:  string,
    password?: string
}
export const Login = () => {
    const dispatch = useAppDispatch();

    const isLoggedIn = useSelector(selectIsLoggedIn);

    const formik = useFormik({
        validate: (values) => {
            const errors: FormikErrorType = {}
            if (!values.email) {
                errors.email = 'Required'
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address'
            }
            if (!values.password) {
                errors.password = 'Required'
            } else if (values.password.length <= 4) {
                errors.password = 'Password length must be more than 4 symbols'
            }
            return errors
        },
        initialValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
        onSubmit: (values, formikHelpers) => {

            dispatch(login(values))
                .unwrap()
                .then((res) => console.log(res))
                .catch((data: BaseResponseType) => {

                    const {fieldsErrors} = data;
                    fieldsErrors.forEach((fieldError) => {
                        formikHelpers.setFieldError(fieldError.field, fieldError.error);
                    });
                });
        },
    });

    if (isLoggedIn) {
        return <Navigate to={"/"}/>;
    }

    return (
        <Grid container justifyContent="center">
            <Grid item xs={4}>
                <form onSubmit={formik.handleSubmit}>
                    <FormControl>
                        <FormLabel>
                            <p>
                                To log in get registered{" "}
                                <a href={"https://social-network.samuraijs.com/"} target={"_blank"} rel="noreferrer">
                                    here
                                </a>
                            </p>
                            <p>or use common test account credentials:</p>
                            <p> Email: free@samuraijs.com</p>
                            <p>Password: free</p>
                        </FormLabel>
                        <FormGroup>
                            <TextField label="Email" margin="normal" {...formik.getFieldProps("email")} />
                            {formik.errors.email  && formik.touched.email ?
                                <div className={s.error}>{formik.errors.email}</div> : null}
                            <TextField type="password" label="Password"
                                       margin="normal" {...formik.getFieldProps("password")} />
                            {formik.errors.password && formik.touched.password ?
                                <div className={s.error}>{formik.errors.password}</div> : null}
                            <FormControlLabel
                                label={"Remember me"}
                                control={<Checkbox {...formik.getFieldProps("rememberMe")}
                                                   checked={formik.values.rememberMe}/>}
                            />
                            <Button disabled={Object.values(formik.errors).some((error) => !!error)} type={"submit"} variant={"contained"} color={"primary"}>
                                Login
                            </Button>
                        </FormGroup>
                    </FormControl>
                </form>
            </Grid>
        </Grid>
    );
};
// disabled={Object.values(formik.errors).some((error) => !!error)}