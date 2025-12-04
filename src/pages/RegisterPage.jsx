import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e)=>{
    e.preventDefault();
    try{
      await API.post("/auth/register",{ name,email,password });
      navigate("/login");
    }catch(err){
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #E7DDFF 0%, #F5F2FF 50%, #FFFFFF 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      position: "relative"
    }}>
      {/* Decorative elements */}
      <div style={{
        position: "absolute",
        top: "5%",
        right: "10%",
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: "rgba(231, 221, 255, 0.4)",
        zIndex: 0
      }}></div>
      <div style={{
        position: "absolute",
        bottom: "10%",
        left: "5%",
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "rgba(231, 221, 255, 0.25)",
        zIndex: 0
      }}></div>
      <div style={{
        position: "absolute",
        top: "50%",
        left: "5%",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "rgba(231, 221, 255, 0.3)",
        zIndex: 0
      }}></div>
      
      <div style={{
        background: "rgba(255, 255, 255, 0.9)",
        backdropFilter: "blur(10px)",
        padding: "50px 40px",
        borderRadius: "24px",
        boxShadow: "0 25px 50px rgba(231, 221, 255, 0.3)",
        width: "100%",
        maxWidth: "420px",
        border: "1px solid rgba(231, 221, 255, 0.5)",
        position: "relative",
        zIndex: 1
      }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            width: "60px",
            height: "60px",
            background: "linear-gradient(135deg, #E7DDFF, #D4C5FF)",
            borderRadius: "50%",
            margin: "0 auto 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            color: "white",
            fontWeight: "bold"
          }}>+</div>
          <h1 style={{ color: "#4A4A4A", fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0" }}>Join Us</h1>
          <p style={{ color: "#8B8B8B", margin: 0, fontSize: "16px" }}>Create your account to get started</p>
        </div>

        {error && (
          <div style={{
            background: "rgba(255, 107, 107, 0.1)",
            color: "#D63031",
            padding: "14px 16px",
            borderRadius: "12px",
            marginBottom: "24px",
            border: "1px solid rgba(255, 107, 107, 0.2)",
            fontSize: "14px"
          }}>{error}</div>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e)=>setName(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "16px 20px",
              border: "2px solid #E7DDFF",
              borderRadius: "16px",
              fontSize: "16px",
              outline: "none",
              background: "rgba(231, 221, 255, 0.05)",
              transition: "all 0.3s ease",
              boxSizing: "border-box"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#D4C5FF";
              e.target.style.background = "rgba(231, 221, 255, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E7DDFF";
              e.target.style.background = "rgba(231, 221, 255, 0.05)";
            }}
          />
          
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "16px 20px",
              border: "2px solid #E7DDFF",
              borderRadius: "16px",
              fontSize: "16px",
              outline: "none",
              background: "rgba(231, 221, 255, 0.05)",
              transition: "all 0.3s ease",
              boxSizing: "border-box"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#D4C5FF";
              e.target.style.background = "rgba(231, 221, 255, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E7DDFF";
              e.target.style.background = "rgba(231, 221, 255, 0.05)";
            }}
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "16px 20px",
              border: "2px solid #E7DDFF",
              borderRadius: "16px",
              fontSize: "16px",
              outline: "none",
              background: "rgba(231, 221, 255, 0.05)",
              transition: "all 0.3s ease",
              boxSizing: "border-box"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#D4C5FF";
              e.target.style.background = "rgba(231, 221, 255, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#E7DDFF";
              e.target.style.background = "rgba(231, 221, 255, 0.05)";
            }}
          />
          
          <button
            type="submit"
            style={{
              background: "linear-gradient(135deg, #E7DDFF 0%, #D4C5FF 100%)",
              color: "#4A4A4A",
              padding: "16px",
              border: "none",
              borderRadius: "16px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s ease",
              boxShadow: "0 8px 20px rgba(231, 221, 255, 0.4)",
              marginTop: "8px"
            }}
            onMouseOver={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 12px 25px rgba(231, 221, 255, 0.5)";
            }}
            onMouseOut={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 8px 20px rgba(231, 221, 255, 0.4)";
            }}
          >
            <b>Create Account</b>
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "32px" }}>
          <span style={{ color: "#8B8B8B", fontSize: "15px" }}>Already have an account? </span>
          <span
            style={{ color: "#A084E8", cursor: "pointer", fontWeight: "600", fontSize: "15px" }}
            onClick={()=>navigate("/login")}
          >
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
