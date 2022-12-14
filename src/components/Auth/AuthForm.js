import React , { useState , useRef , useContext } from "react";
import { useHistory } from "react-router-dom";
import AuthContext from "../../store/auth-context";

import classes from './AuthForm.module.css';


const AuthForm = () => {
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);

    const emailInputRef = useRef();
    const passwordInputRef = useRef();
    const authCtx = useContext(AuthContext);
    const [isLogin, setIsLogin] = useState(true);

    const switchAuthModeHandler = () => {
      setIsLogin((prevState) => !prevState);
    };

    const submitHandler = (event) => {
        event.preventDefault();

        const enteredEmail = emailInputRef.current.value;
        const enteredPassword = passwordInputRef.current.value;

        setIsLoading(true);
        let url;
        if(isLogin){
          url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCVvVgCHqSLaKTiHjlO8Z-DehF45NMt6zw'
        }else{
          url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCVvVgCHqSLaKTiHjlO8Z-DehF45NMt6zw'
        }
        fetch(
            url,
           {
             method: 'POST',
             body: JSON.stringify({
               email : enteredEmail,
               password : enteredPassword,
               returnSecureToken : true,
             }),
             headers : {
               'Content-Type' : 'application/json',
             },
           },
         ).then((res) => {
           setIsLoading(false);
           if(res.ok){
             return res.json();
           }else{
             return res.json().then((data) => {
               console.log(data);
               let errorMessage = 'Authentication failed';
               throw new Error(errorMessage);
             });
           }
         })
         .then((data) => {
           authCtx.login(data.idToken, data.email);
           history.replace('/store');
         }).catch((err) => {
           alert(err.message);
        })
    };

    return (
        <section className={classes.auth}>
            <h1>Login</h1>
            <form onSubmit={submitHandler}>
                <div className={classes.control}>
                    <label htmlFor='email'>Your Email</label>
                    <input type='email' id='email' required ref={emailInputRef}/>
                </div>
                <div className={classes.control}>
                    <label htmlFor='password'>Your Password</label>
                    <input type='password' id='password' required ref={passwordInputRef}/>
                </div>
                <div className={classes.actions}>
                    {!isLoading && <button>{isLogin ? 'Login' : 'Create Account'}</button>}
                    {isLoading && <p>Sending Request...</p>}
                    <button
                     type='button'
                     className={classes.toggle}
                     onClick={switchAuthModeHandler}
                    >
                      {isLogin ? 'Create new account' : 'Login with existing account'}
             
                    </button>
                </div>
            </form>
        </section>
    );
};

export default AuthForm;