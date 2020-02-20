import React from 'react'
import Aux from '../../hoc/Auxiliry/Auxiliry'
import Burger from  '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls'
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import {connect} from 'react-redux'
import * as actions from '../../store/actions/index'

export const BurgerBuilder = props =>{
    const [purchasing, setPurchasing] = React.useState(false)
    const {onInitIngredients} = props
    React.useEffect(()=>{
        onInitIngredients()
    }, [onInitIngredients])
    // Rewatch 166
    const updatePurchaseState = (ingredients)=>{
        // Basic converting object to array with object and key
        const sum = Object.keys(ingredients)
            .map(igKey=>{
                return ingredients[igKey]
            })
            .reduce((sum, el)=>{
                // Sum starts with 0 (see at the end) and el is the current value of the array object
                return sum + el 
            },0)
        // if sum is higher than 0 it is true
        // this.setState({purchasable: sum>0})
        return sum >0

    }
    const purchaseHandler = ()=>{
        // we need to use this kind of function to get the this binding to this class
        if(props.isAuth){
            setPurchasing(true)
        }else{
            props.onSetAuthRedirectPath('/checkout')
            props.history.push('/auth')
        }
    }

    const purchaseCancelHandler = ()=>{
        setPurchasing(false)
    }

    const purchaseContinueHandler = ()=>{
        props.onInitPurchase()
        props.history.push('/checkout')
    }

    // 164 REWATCH
    const disabledInfo = {
        ...props.ings 
    }
    for (let key in disabledInfo){
        disabledInfo[key] = disabledInfo[key] <=0
    }
    let orderSummary = null
    
    let burger = props.error ? <p>Ingredients cant be loaded</p> : <Spinner/> 
    if(props.ings){
        burger = (
            <Aux>
                <Burger ingredients={props.ings}/>
                <BuildControls 
                    ingredientAdded={props.onIngredientAdded}
                    ingredientRemoved={props.onIngredientRemoved}
                    disabled={disabledInfo}
                    price={props.price}
                    purchasable={updatePurchaseState(props.ings)}
                    ordered={purchaseHandler}
                    isAuth={props.isAuth}
                />
            </Aux>
        )
        orderSummary = <OrderSummary 
            price={props.price}
            ingredients={props.ings}
            purchaseCancel={purchaseCancelHandler}
            purchaseContinue={purchaseContinueHandler}
        />
    }
    return(
        <Aux>
            {/* Here is a improvement state possible. Because there is no need to update teh order summary when it it is not showing */}
            {burger}
            <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
                {orderSummary}
            </Modal>>
        </Aux>
    )
    
}

const mapDispatchToProps = dispatch =>{
    return{
        onIngredientAdded: (name)=>dispatch(actions.addIngredient(name)),
        onIngredientRemoved: (name)=>dispatch(actions.removeIngredient(name)),
        onInitIngredients: () => dispatch(actions.initIngredients()),
        onInitPurchase: () => dispatch(actions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(actions.setAuthRedirectPath(path))
    }
}
const mapStateToProps = state =>{
    return{
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuth: state.auth.token !== null
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios))