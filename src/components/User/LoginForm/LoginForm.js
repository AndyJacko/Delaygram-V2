import React, { useContext, useRef, useState } from "react";

import AuthContext from "../../../store/authContext";

import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";

const LoginForm = () => {
  const [message, setMessage] = useState(false);
  const userInputRef = useRef();
  const passwordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const user = userInputRef.current.value;
    const pass = passwordInputRef.current.value;

    if (
      !user ||
      !pass ||
      user.trim() === "" ||
      pass.trim() === "" ||
      pass.length < 8 ||
      pass.length > 20
    ) {
      setMessage(
        <p className="text-danger">{"Please enter valid details..."}</p>
      );
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URI}/login/`, {
      method: "POST",
      body: JSON.stringify({ username: user, password: pass }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();

    if (responseData.token) {
      const expTime = new Date(new Date().getTime() + 1800000);
      authCtx.onLogin(
        responseData.token,
        responseData.user,
        expTime.toISOString()
      );
    } else {
      setMessage(<p className="text-danger">Login failed...</p>);
      userInputRef.current.value = "";
      passwordInputRef.current.value = "";
    }
  };

  return (
    <div className="mb-3 text-center w-50 mx-auto">
      <h2 className="text-uppercase">Login</h2>

      <form onSubmit={onSubmitHandler}>
        <div className="mt-3 p-3 bg-dark rounded">
          {message && message}

          <Input required ty="ext" id="lu" ph="Username" rf={userInputRef} />

          <Input
            required
            ty="password"
            id="lp"
            ph="Password"
            rf={passwordInputRef}
          />

          <Button colour="btn-secondary" label="Login" />
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
