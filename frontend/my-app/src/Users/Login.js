import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { clearAuthError, login } from "../actions/userAction";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.authState
  );

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/invoices');
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
        onClose: () => {
          dispatch(clearAuthError());
        },
      });
    }
  }, [error, isAuthenticated, dispatch, navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}>
      <div className="card shadow-lg border-0 p-5 mb-3" style={{ borderRadius: '1.5rem', background: '#fff', maxWidth: 400, width: '100%' }}>
        <div className="d-flex flex-column align-items-center mb-3">
          <span style={{ fontSize: '3.5rem', color: '#007bff', marginBottom: '0.5rem' }}>
            <i className="fa fa-user-circle"></i>
          </span>
          <h2 className="mb-2 mt-2 text-center" style={{ fontWeight: 800, color: '#2d3a4b', letterSpacing: '1px' }}>Login</h2>
        </div>
        <form onSubmit={submitHandler} autoComplete="off">
          <div className="form-floating mb-3">
            <input
              type="email"
              id="email_field"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <label htmlFor="email_field">Email</label>
          </div>
          <div className="form-floating mb-3 position-relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password_field"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <label htmlFor="password_field">Password</label>
            <button
              type="button"
              className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
              style={{ color: '#007bff', textDecoration: 'none', fontSize: '1.2rem' }}
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
            </button>
          </div>
          <div className="d-flex justify-content-between mb-3">
            <Link to="/password/forgot" className="text-decoration-none">Forgot Password?</Link>
            <Link to="/register" className="text-decoration-none">New User?</Link>
          </div>
          <button
            id="login_button"
            type="submit"
            className="btn btn-primary btn-block w-100 py-2"
            style={{ borderRadius: '2rem', fontWeight: 600 }}
            disabled={loading}
          >
            {loading ? "Loading..." : "LOGIN"}
          </button>
        </form>
      </div>
      <Link to="/" className="btn btn-outline-secondary w-100" style={{ maxWidth: 400, borderRadius: '2rem', fontWeight: 500, fontSize: '1rem' }}>
        <i className="fa fa-home me-2"></i>Back to Home
      </Link>
    </div>
  );
}