import React, { useState, useEffect, useContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";
import history from "./utils/history";
import UserAPI from "./utils/UserAPI";
import { WebAuth } from "auth0-js";

const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname);

export const Auth0Context = React.createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
  children,
  ...initOptions
}) => {
  const [email, setEmail] = useState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState();
  const [auth0Client, setAuth0] = useState();
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpError, setOtpError] = React.useState(false);

  useEffect(() => {
    const initAuth0 = async () => {
      setLoading(true)
      const auth0FromHook = new WebAuth(initOptions);
      setAuth0(auth0FromHook);
      console.log('hash', window.location.hash)
      if (window.location.hash) {
        console.log('hash!!!')
        auth0FromHook.parseHash((
          err,
          authResult
        ) => {
          console.log('here', authResult)
          if (err) {
            return console.log(err);
          }
          console.log('authres', authResult)
          auth0FromHook.client.userInfo(authResult.accessToken, function (err, user) {
            console.log(user)
            setIsAuthenticated(true);
            setUser(user);
          });
        });
      } else {
        console.log('else');
        console.log(isAuthenticated)
        if (user === null) {
          history.push("/login");
        }
      }


      if (isAuthenticated) {
        console.log('AUTENTICATED!')
        // Add User from Auth0 to our database if they don't exist yet
        UserAPI.getUser(user.email)
          .then(res => {
            if (!res.data) {
              UserAPI.saveUser({
                username: user.nickname,
                email: user.email,
                image: user.picture
              })
                .then(console.log("User has been added!"))
                .catch(err => console.log("Error adding User: " + err));
            } else {
              console.log("User already exists!");
            }
          })
          .catch(err => console.log("Error finding User: " + err));
      }

      setLoading(false);
    };
    initAuth0();
  }, []);

  const handleAuth = (email) => {
    setLoading(true);
    auth0Client.passwordlessStart(
      {
        connection: "email",
        send: "code",
        email: email
      },
      (error, result) => {
        if (result.Id) {
          setOtpSent(true);
          setLoading(false);
        } else {
          console.warn(error)
          setLoading(false);
        }
      }
    );
  };

  const handleVerifyToken = (email, otp) => {
    setLoading(true);
    auth0Client.passwordlessLogin(
      {
        connection: "email",
        email: email,
        verificationCode: otp
      },
      function (err, res) {
        if (err) {
          console.error(err);
          setOtpError(true);
          setLoading(false);
        } else {
          console.log('resssss', res)
        }
      }
    );
  };

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        handleAuth,
        otpSent,
        otpError,
        handleVerifyToken,
        email,
        setEmail,
        logout: (...p) => auth0Client.logout(...p)
      }}
    >
      {children}
    </Auth0Context.Provider>
  );
};
