import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await axios.post("/api/auth/login", formData); // رابط الـ API
            login(res.data.user, res.data.token);

            // Redirect حسب نوع المستخدم
            if (res.data.user.role === "admin") navigate("/admin");
            else navigate("/student");
        } catch (err) {
            setError(err.response?.data?.message || "خطأ في تسجيل الدخول");
        }
    };

    return (
        <div className="auth-container">
            <h2>تسجيل الدخول</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="البريد الإلكتروني" onChange={handleChange} required />
                <input type="password" name="password" placeholder="كلمة المرور" onChange={handleChange} required />
                <button type="submit">تسجيل الدخول</button>
            </form>
            <p>ليس لديك حساب؟ <Link to="/register">إنشاء حساب</Link></p>
        </div>
    );
};

export default Login;
