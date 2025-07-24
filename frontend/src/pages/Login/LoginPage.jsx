import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import LogoImg from "../../assets/images/logo1.png"; 
import "./LoginPage.css";


export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loginAs, setLoginAs] = useState("");
    const navigate = useNavigate();
    const { t } = useTranslation();


    const handleSignIn = (e) => {
        e.preventDefault();

        if (!loginAs) {
            alert("Please select a login role.");
            return;
        }

        if (!email || !password) {
            alert("Please fill in both email and password.");
            return;
        }

        if (loginAs === "Customer") {
            navigate("/pages/Customer/CustomerDash");
        } else if (loginAs === "Farmer") {
            navigate("/pages/Farmer/FarmerDash");
        } else if (loginAs === "Delivery") {
            navigate("/pages/DeliveryAgent/DeliveryDash");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                        <div className="logo-icon">
                            <img src={LogoImg} alt="LEAF Logo" className="logo-image" />
                        </div>

                <div className="welcome-section">
                    <h1 className="welcome-title">{t('welcome_back')}</h1>
                    <p className="welcome-subtitle">Sign in to your LEAF account to continue</p>
                </div>

                <div className="form-section">

                    <div className="input-group">
                        <label className="input-label">{t('email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="input-field"
                        />
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('password')}</label>
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="input-field password-input"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="password-toggle"
                            >
                                {showPassword ? (
                                    <EyeOff className="eye-icon" />
                                ) : (
                                    <Eye className="eye-icon" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">{t('login_as')}</label>
                        <select
                            value={loginAs}
                            onChange={(e) => setLoginAs(e.target.value)}
                            className="select-field"
                        >
                            <option value="">{t('select_your_role')}</option>
                            <option value="Farmer">{t('farmer')}</option>
                            <option value="Customer">{t('customer')}</option>
                            <option value="Delivery">{t('delivery_agent')}</option>
                        </select>
                    </div>

                    <button onClick={handleSignIn} className="signin-button">
                        {t('login')}
                    </button>
                </div>

                <div className="footer-section">
                    <a href="#" className="forgot-password-link">
                        {t('forgot_password')}
                    </a>
                    <div className="signup-text">
                        {t('Dont_have_an_account?')}{" "}
                        <Link to="/" className="signup-link">
                            {t('register')}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}