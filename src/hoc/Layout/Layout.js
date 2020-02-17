import React from  'react'
import Aux from '../Auxiliry/Auxiliry'
import classes from './Layout.module.css'
import Toolbar from '../../components/Navigation/Toolbar/Toolbar'
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer'
import {connect} from 'react-redux'

const Layout = props =>{
    const [sideDrawerIsVisible, setSideDrawerIsVisible] = React.useState(false)
    const sideDrawerToggle = () =>{
        setSideDrawerIsVisible(!sideDrawerIsVisible)
        // This belowe is a nono because setState is asynchronous
        // this.setState({
        //     showSideDrawer: !this.state.showSideDrawer
        // })
    }
    const sideDrawerClosed = ()=>{
        setSideDrawerIsVisible(false)
    }
    return(
        <Aux>
            <Toolbar
                isAuth={props.isAuth} 
                drawerToggleClicked={sideDrawerToggle}
            />
            <SideDrawer 
                open={sideDrawerIsVisible} 
                closed={sideDrawerClosed}
                isAuth={props.isAuth}
            />
            <main className={classes.Content}>
                {props.children}
            </main>
        </Aux>
    )
    
}
    
const mapStateToProps = state=>{
    return{
        isAuth: state.auth.token !== null 
    }
}

export default connect(mapStateToProps)(Layout)