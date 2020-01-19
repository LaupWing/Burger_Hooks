import * as actionTypes from './actionTypes'
import axios from '../../axios-orders'
export const purchaseBurgerSucces = (id, orderData)=>{
    return {
        type: actionTypes.PURCHASE_BURGER_SUCCES,
        orderId: id,
        orderData
    }
}

export const purchaseBurgerStart = () =>{
    return {
        type: actionTypes.PURCHASE_BURGER_START
    }
}

export const purchaseBurgerFail = (error)=>{
    return {
        type: actionTypes.PURCHASE_BURGER_FAIL,
        error
    }
}

export const purchaseBurger = (orderData) =>{
    return dispatch => {
        dispatch(purchaseBurgerStart())
        axios.post('/orders.json', orderData)
            .then(res=>{
                dispatch(purchaseBurgerSucces(res.data.name, orderData))
            })
            .catch(e=>{
                dispatch(purchaseBurgerFail(e))
            })
    }
}

export const purchaseInit =  () =>{
    return{
        type: actionTypes.PURCHASE_INIT
    }
}

export const fetchOrdersSucces = (orders)=>{
    return{
        type: actionTypes.FETCH_ORDERS_SUCCES,
        orders
    }
}

export const fetchOrdersFail = (error)=>{
    return{
        type: actionTypes.FETCH_ORDERS_FAIL,
        error
    }
}

export const fetchOrdersStart = ()=>{
    return{
        type: actionTypes.FETCH_ORDERS_START
    }
}

export const fetchOrders = ()=>{
    return dispatch =>{
        dispatch(fetchOrdersStart())
        axios.get('/orders.json')
            .then(res=>{
                const fetchedOrders= []
                for(let key in res.data){
                    fetchedOrders.push({
                        ...res.data[key],
                        id:key
                    })
                }
                dispatch(fetchOrdersSucces(fetchedOrders))
            })
            .catch(err=>{
                dispatch(fetchOrdersFail(err))
            })
    }
}