import React, { useState, useEffect } from "react";
import { login, reset } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../components/Spinner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isSuccess) {
      navigate("/");
    }
  }, [isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));

    dispatch(reset());
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      email,
      password,
    };

    dispatch(login(userData));
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <main className="auth login">
      <div className="auth__grid">
        {/* Left side */}
        <aside className="auth__aside">
          <h1 className="auth__title">
            Welcome <span>back</span>
          </h1>
          <p className="auth__tagline">
            Continue where you left off — your tasks are waiting.
          </p>
        </aside>

        {/* Right side (form) */}
        <section className="auth__formwrap">
          <form className="auth__form" onSubmit={onSubmit}>
            <h2 className="auth__formtitle">Log In</h2>
            {isError ? (
              <div className="error-message">{message}</div>
            ) : (
              <p className="auth__formlead">Please log into your account.</p>
            )}
            <label className="field">
              <span className="field__label">Email</span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={onChange}
                required
              />
            </label>

            <label className="field">
              <span className="field__label">Password</span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={onChange}
                required
              />
            </label>

            <button type="submit" className="btn">
              Log In
            </button>

            <p className="auth__cta">
              Don’t have an account? <Link to="/register">Sign up</Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Login;
