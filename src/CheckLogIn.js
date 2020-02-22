const CheckLogin = () => {
    
    console.log('CheckLogin called..')
    let url = "http://localhost:5000/login"
    
    fetch(url,
            {mode: 'cors',
            credentials: 'include'},
        ).then(res=> res.json()
            ).then((result)=> {
                console.log('CheckLogIn result: ', result.login)
                return result.login

            },
            (error) => {console.error(error)})
            
    
}
 
export default CheckLogin;
