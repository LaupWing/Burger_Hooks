import React from 'react'
import Modal from '../../components/UI/Modal/Modal'
import Aux from '../Auxiliry/Auxiliry'
import useHttpErrorHandler from '../../hooks/http-error-handler'

const withErrorHandler = (WrappedComponent, axios)=>{
    return props => {
        const [error, clearError] = useHttpErrorHandler(axios)
        return(
            <Aux>
                <Modal 
                    modalClosed={clearError}
                    show={error}>
                    {error ? error.message : null}
                </Modal>
                <WrappedComponent {...props}/>
            </Aux>
        )
    }
}

export default withErrorHandler