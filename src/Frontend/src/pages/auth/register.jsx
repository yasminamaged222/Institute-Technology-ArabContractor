import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("ﬂ·„… «·„—Ê— €Ì— „ ÿ«»ﬁ…");
            return;
        }

        try {
            // —«»ÿ API «· ”ÃÌ·
            await axios.post("/api/auth/register", formData);

            // »⁄œ «· ”ÃÌ·°  ÊÃÂ ··‹ Login
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "ÕœÀ Œÿ√ √À‰«¡ «· ”ÃÌ·");
        }
    };

    return (
        <div className="auth-container" style={{ maxWidth: "400px", margin: "50px auto", padding: "30px", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#fff" }}>
            <h2 style={{ textAlign: "center", marginBottom: "20px" }}>≈‰‘«¡ Õ”«» ÃœÌœ</h2>

            {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: "15px" }}>
                    <label>«·«”„ «·ﬂ«„·</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" required />
                </div>

                <div className="form-group" style={{ marginBottom: "15px" }}>
                    <label>«·»—Ìœ «·≈·ﬂ —Ê‰Ì</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
                </div>

                <div className="form-group" style={{ marginBottom: "15px" }}>
                    <label>ﬂ·„… «·„—Ê—</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} className="form-control" required />
                </div>

                <div className="form-group" style={{ marginBottom: "15px" }}>
                    <label> √ﬂÌœ ﬂ·„… «·„—Ê—</label>
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-control" required />
                </div>

                <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#0d47a1", color: "#fff", fontWeight: "bold", border: "none", borderRadius: "5px" }}>
                     ”ÃÌ·
                </button>
            </form>

            <p style={{ textAlign: "center", marginTop: "15px" }}>
                ·œÌﬂ Õ”«»ø <Link to="/login" style={{ color: "#0d47a1", fontWeight: "bold" }}> ”ÃÌ· «·œŒÊ·</Link>
            </p>
        </div>
    );
};

export default Register;
