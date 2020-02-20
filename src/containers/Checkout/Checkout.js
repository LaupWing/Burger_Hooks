import React from 'react'
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary'
import {Route, Redirect} from 'react-router-dom'
import ContactData from './ContactData/ContactData'
import {connect} from 'react-redux'


const Checkout = props =>{
    const checkoutCancelledHandler = () =>{
        props.history.goBack()
    }
    const checkoutContinuedHandler = () =>{
        props.history.replace('/checkout/contact-data')
    }

    let summary = <Redirect to="/"/>
    if(props.ings){
        const purchaseRedirect = props.purchased ? <Redirect to="/"/> : null
        summary = (
            <div>
                {purchaseRedirect}
                <CheckoutSummary 
                    ingredients={props.ings}
                    checkoutCancelled={checkoutCancelledHandler}
                    checkoutContinued={checkoutContinuedHandler}
                />
                <Route 
                    path={props.match.path + '/contact-data'}
                    // Instead of using the  component to connect a component to the route we use a render method
                    // Why?
                    // In order to pass the ingredient list to this component 
                    // component={ContactData}
                    component={ContactData}
                />
            </div>
        )
    }
    return summary
    
}

const mapStateToProps = state =>{
    return{
        ings: state.burgerBuilder.ingredients,
        purchased: state.order.purchased
    }
}

export default connect(mapStateToProps)(Checkout)