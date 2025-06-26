import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register, clearAuthError } from "../actions/userAction";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated, otpSent } = useSelector(
    (state) => state.authState
  );

  const validatePassword = (password) => {
    const passRegex = /^.{6,}$/; // At least 6 characters
    if (!passRegex.test(password)) {
      setPasswordError("Password must be at least 6 characters long.");
    } else {
      setPasswordError("");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value.trimStart() });

    if (name === "password") {
      validatePassword(value);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (passwordError) {
      toast.error("Please fix the password issue before submitting.", {
        position: "bottom-center",
      });
      return;
    }

    const formData = {
      name: userData.name.trim(),
      email: userData.email.trim(),
      password: userData.password,
    };

    dispatch(register(formData));
  };

  useEffect(() => {
    if (otpSent) {
      toast.success("OTP sent to your email!", { position: "bottom-center" });
      navigate("/verify-otp", { state: { email: userData.email } });
    }

    if (isAuthenticated) {
      navigate("/");
    }

    if (error) {
      toast.error(error, {
        position: "bottom-center",
        onClose: () => dispatch(clearAuthError()),
      });
    }
  }, [otpSent, isAuthenticated, error, dispatch, navigate, userData.email]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-5">
            <div className="card shadow-lg border-0 p-4" style={{ borderRadius: '1.5rem', background: '#fff', position: 'relative' }}>
              <Link to="/" className="btn btn-outline-secondary position-absolute" style={{ left: 24, top: 24, borderRadius: '2rem', fontWeight: 500, fontSize: '1rem', zIndex: 2 }}>
                <i className="fa fa-home me-2"></i>Back to Home
              </Link>
              <div className="d-flex flex-column align-items-center mb-3">
                <span style={{ fontSize: '3rem', color: '#28a745' }}>
                  <i className="fa fa-user-plus"></i>
                </span>
                <h2 className="mb-2 mt-2 text-center" style={{ fontWeight: 800, color: '#2d3a4b' }}>Register</h2>
              </div>
              <form onSubmit={submitHandler} noValidate autoComplete="off">
                <div className="form-floating mb-3">
                  <input
                    name="name"
                    onChange={onChange}
                    type="text"
                    id="name_field"
                    className="form-control"
                    value={userData.name}
                    placeholder="Name"
                    required
                  />
                  <label htmlFor="name_field">Name</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    id="email_field"
                    name="email"
                    onChange={onChange}
                    className="form-control"
                    value={userData.email}
                    placeholder="Email"
                    required
                  />
                  <label htmlFor="email_field">Email</label>
                </div>
                <div className="form-floating mb-3 position-relative">
                  <input
                    name="password"
                    onChange={onChange}
                    type={showPassword ? "text" : "password"}
                    id="password_field"
                    className="form-control"
                    value={userData.password}
                    placeholder="Password"
                    required
                  />
                  <label htmlFor="password_field">Password</label>
                  <button
                    type="button"
                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y"
                    style={{ color: '#28a745', textDecoration: 'none', fontSize: '1.2rem' }}
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                  >
                    <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`} style={{ color: '#28a745' }}></i>
                  </button>
                </div>
                {passwordError && (
                  <small className="text-danger">{passwordError}</small>
                )}
                <button
                  id="register_button"
                  type="submit"
                  className="btn btn-primary btn-block py-2 w-100 mt-2"
                  style={{ borderRadius: '2rem', fontWeight: 600 }}
                  disabled={
                    loading ||
                    !userData.name ||
                    !userData.email ||
                    !userData.password
                  }
                >
                  {loading ? "Loading..." : "Register"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
