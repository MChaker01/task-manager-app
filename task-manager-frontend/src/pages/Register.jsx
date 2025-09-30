import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";
import "../assets/styles/auth.css";
import Spinner from "../components/Spinner";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  const { username, email, password, password2 } = formData;

  useEffect(() => {
    if (isError) {
      console.error(message);
    }

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

  const onSubmit = (e) => {
    e.preventDefault();

    if (password !== password2) {
      console.log("Passwords don't match");
    } else {
      const userData = {
        username,
        email,
        password,
      };

      dispatch(register(userData));
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <main className="auth register">
      <div className="auth__grid">
        {/* Left side */}
        <aside className="auth__aside">
          <h1 className="auth__title">
            Organize <span>everything</span>
          </h1>
          <p className="auth__tagline">
            Your work, your ideas, your tasks — streamlined in one place.
          </p>

          <ul className="auth__bullets" aria-hidden="true">
            <li>✓ Capture</li>
            <li>✓ Plan</li>
            <li>✓ Complete</li>
          </ul>
        </aside>

        {/* Right side (form) */}
        <section className="auth__formwrap">
          <form className="auth__form" onSubmit={onSubmit}>
            <h2 className="auth__formtitle">Sign Up</h2>
            {isError ? (
              <div className="error-message">{message}</div>
            ) : (
              <p className="auth__formlead">
                Create your account to get started.
              </p>
            )}

            <label className="field">
              <span className="field__label">Username</span>
              <input
                type="text"
                name="username"
                value={username}
                onChange={onChange}
                required
              />
            </label>

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

            <label className="field">
              <span className="field__label">Confirm Password</span>
              <input
                type="password"
                name="password2"
                value={password2}
                onChange={onChange}
                required
              />
            </label>

            <button type="submit" className="btn">
              Create Account
            </button>

            <p className="auth__cta">
              Already registered? <Link to="/login">Log in</Link>
            </p>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Register;
