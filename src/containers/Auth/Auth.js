import React from 'react'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import classes from './Auth.module.css'
import * as actions from '../../store/actions/index'
import {connect} from 'react-redux'
import Spinner from '../../components/UI/Spinner/Spinner'
import {Redirect} from 'react-router-dom'

const Auth =(props)=>{
    const [authForm, setAuthForm] = React.useState({
        email: {
            elementType: 'input',
            elementConfig:{
                type: 'email',
                placeholder: 'Your Email'
            },
            value: '',
            validation:{
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig:{
                type: 'password',
                placeholder: 'password'
            },
            value: '',
            validation:{
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        },
    })
    const [isSignup, setIsSignup] = React.useState(true)
    
    const {
        building, 
        authRedirectPath, 
        onSetAuthRedirectPath} = props
    React.useEffect(()=>{
        if(building && authRedirectPath !== '/'){
            onSetAuthRedirectPath()
        }
    },[building, authRedirectPath, onSetAuthRedirectPath])


    const checkValidity = (value, rules)=>{
        let isValid = true
        if(rules.required){
            isValid = value.trim() !== '' && isValid
        }
        if(rules.minLength){
            isValid = value.length >= rules.minLength && isValid
        }
        if(rules.maxLength){
            isValid = value.length <= rules.minLength && isValid
        }
        if (rules.isEmail) {
            const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
            isValid = pattern.test(value) && isValid
        }

        if (rules.isNumeric) {
            const pattern = /^\d+$/;
            isValid = pattern.test(value) && isValid
        }
        return isValid
    }
    const inputChangedHandler = (event, controlName)=>{
        const updatedControls ={
            ...authForm,
            [controlName]:{
                ...authForm[controlName],
                value: event.target.value,
                valid: checkValidity(event.target.value, authForm[controlName].validation),
                touched: true
            }
        }
        setAuthForm(updatedControls)
    }
    const submitHandler = (event)=>{
        event.preventDefault();
        props.onAuth(authForm.email.value, authForm.password.value, isSignup)
    }

    const switchAuthModeHandler = ()=>{
        setIsSignup(!isSignup)
    }

    
    const formElementsArray = []
    for (let key in authForm){
        formElementsArray.push({
            id: key,
            config: authForm[key]
        })
    }
    let form = formElementsArray.map(formElement=>(
        <Input 
            key={formElement.id}
            elementType={formElement.config.elementType}
            elementConfig={formElement.config.elementConfig}
            value={formElement.config.value}
            invalid={!formElement.config.valid}
            shouldValidate={formElement.config.validation}
            touched={formElement.config.touched}
            changed={(event)=>inputChangedHandler(event, formElement.id)}
        />
        ))
    if(props.loading){
        form = <Spinner/>
    }

    let errorMessage = null
    if(props.error){
        errorMessage = (
        <p>{props.error.message}</p>
        )
    }
    let authRedirect = null
    if(props.isAuth){  
        authRedirect =  <Redirect to={props.authRedirectPath}/>
    }
    return (
        <div className={classes.Auth}>
            {authRedirect}
            {errorMessage}
            <form onSubmit={submitHandler}>
                {form}
                <Button btnType="Success">SUBMIT</Button>
            </form>
            <Button 
                clicked={switchAuthModeHandler}
                btnType="Danger"
            >
                SWITCH TO {isSignup ? 'LOGIN':'SIGNUP'}
            </Button>
        </div>
    )
    
}

const mapStateToProps = state =>{
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuth: state.auth.token !== null,
        building: state.burgerBuilder.building,
        authRedirect: state.auth.authRedirectPath
    }
}

const mapDispatchToProps  =dispatch =>{
    return{
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email,password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Auth)