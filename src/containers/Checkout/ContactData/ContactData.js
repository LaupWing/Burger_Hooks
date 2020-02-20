import React from 'react'
import Button from '../../../components/UI/Button/Button'
import classes from './ContactData.module.css'
import axios from '../../../axios-orders'
import Spinner from '../../../components/UI/Spinner/Spinner'
import Input from '../../../components/UI/Input/Input'
import {connect} from 'react-redux'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions/index' 


const ContactData = props =>{
    const [orderForm, setOrderForm] = React.useState({
            name: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Your name'
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Zipcode'
                },
                value: '',
                validation:{
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig:{
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig:{
                    type: 'email',
                    placeholder: 'example@hotmail.com'
                },
                value: '',
                validation:{
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig:{
                    options:[
                        {
                            value: 'fastest',
                            display: 'Fastest'
                        },
                        {
                            value: 'cheapest',
                            display: 'Cheapest'
                        },
                    ]
                },
                value: 'fastest',
                valid: true,
                validation: {}
            },
        })
    const [formIsValid, setFormIsValid]=  React.useState(false)
    
    const orderHandler = (event)=>{
        event.preventDefault()
        
        const formData = {}
        for(let formElId in orderForm){
            formData[formElId] =  orderForm[formElId].value
        }
        const order = {
            ingredients: props.ings,
            price: props.price, 
            orderData: formData,
            userId: props.userId
        }
        props.onOrderBurger(order, props.token)
    }

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

    const inputChangedHandler = (event, inputId)=>{
        const updatedOrderForm = {
            ...this.state.orderForm
        }
        const updatedFormEl = {
            ...updatedOrderForm[inputId]
        }

        updatedFormEl.value = event.target.value
        updatedFormEl.valid = checkValidity(updatedFormEl.value, updatedFormEl.validation)
        updatedFormEl.touched = true 
        updatedOrderForm[inputId] = updatedFormEl

        let formIsValid = true
        for(let inputId in updatedOrderForm){
            formIsValid = updatedOrderForm[inputId].valid && formIsValid
        }
        setOrderForm(updatedOrderForm)
        setFormIsValid(formIsValid)
    }
    const formElementsArray = []
    for (let key in this.state.orderForm){
        formElementsArray.push({
            id: key,
            config: this.state.orderForm[key]
        })
    }
    let form = (
            <form onSubmit={orderHandler}>
                {formElementsArray.map(formElement=>(
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
                ))}
                <Button btnType="Success" disabled={!formIsValid}>ORDER</Button>
            </form>);
    if(props.loading){
        form = <Spinner/>
    }
    return(
        <div className={classes.ContactData}>
            <h4>Enter your contact data</h4>
            {form}
        </div>
    )
    
}

const mapDispatchToProps = dispatch =>{
    return{
        onOrderBurger: (orderData, token)=> dispatch(actions.purchaseBurger(orderData, token))
    }
}

const mapStateToProps = state=>{
    return{
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData,axios))