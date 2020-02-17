import React from 'react'
import Modal from '../../components/UI/Modal/Modal'
import Aux from '../Auxiliry/Auxiliry'

const withErrorHandler = (WrappedComponent, axios)=>{
    return props => {
        const [error, setError] = React.useState(null)
        
        const req = axios.interceptors.request.use(req=>{
            setError(null)
            return req
        })
        const res = axios.interceptors.response.use(res=>res, err=>{
            setError(err)
        })
        
        const errorConfirmedHandler = ()=>{
            setError(null)
        }
        React.useEffect(()=>{
            return ()=>{
                axios.interceptors.request.eject(req)
                axios.interceptors.response.eject(res)
            }
        }, [req, res])
            return(
            <Aux>
                <Modal 
                    modalClosed={errorConfirmedHandler}
                    show={error}>
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props}/>
            </Aux>
        )
        }
    
}

export default withErrorHandler