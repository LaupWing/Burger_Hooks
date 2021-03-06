import React from 'react'
import Order from '../../components/Order/Order'
import axios from '../../axios-orders'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../store/actions/index'
import {connect} from 'react-redux'
import Spinner from '../../components/UI/Spinner/Spinner'

const Orders = props =>{
    const {onFetchOrders, token, userId} = props
    React.useEffect(()=>{
        onFetchOrders(token, userId)
    }, [onFetchOrders, token, userId])
    let orders = <Spinner/>
    if(!props.loading){
        orders = props.orders.map(order=>(
            <Order 
                key={order.id}
                ingredients={order.ingredients}
                price={order.price}
                
            />
        ))
    }
    return(
        <div>
            {orders}
        </div>
    )
}

const mapStateToProps = state =>{
    return{
        loading: state.order.loading,
        orders: state.order.orders,
        token: state.auth.token,
        userId: state.auth.userId
    }
}

const mapDispatchToProps = dispatch =>{
    return{
        onFetchOrders: (token, userId) => dispatch(actions.fetchOrders(token, userId))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(Orders,axios))