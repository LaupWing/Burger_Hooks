import reducer from './auth'
import * as actionTypes from '../actions/actionTypes'

describe('auth reducer',()=>{
    it('should return init state', ()=>{
        expect(reducer(undefined, {})).toEqual({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        })
    })

    it('should store token when login',()=>{
        expect(reducer({
            token: null,
            userId: null,
            error: null,
            loading: false,
            authRedirectPath: '/'
        },{
            type: actionTypes.AUTH_SUCCES,
            idToken: 'sometoken',
            userId: 'id'
        })).toEqual({
            token: 'sometoken',
            userId: 'id',
            error: null,
            loading: false,
            authRedirectPath: '/'
        })
    })
})