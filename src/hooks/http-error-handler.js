import {useState, useEffect} from 'react'

export default httpClient => {
    const [error, setError] = useState(null)
        
    const req = httpClient.interceptors.request.use(req=>{
        setError(null)
        return req
    })
    const res = httpClient.interceptors.response.use(res=>res, err=>{
        setError(err)
    })
    
    const errorConfirmedHandler = ()=>{
        setError(null)
    }
    useEffect(()=>{
        return ()=>{
            httpClient.interceptors.request.eject(req)
            httpClient.interceptors.response.eject(res)
        }
    }, [httpClient.interceptors.request, httpClient.interceptors.response, req, res])

    return [error, errorConfirmedHandler]
}