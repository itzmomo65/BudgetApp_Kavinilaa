import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function HomePage() {
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setProfile(res.data))
        .catch(err => {
          console.log("Profile fetch failed:", err);
          setProfile({ name: "User", email: "user@example.com" });
        });
    }
  }, []);

  if (!profile) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ color: "#667eea", fontSize: "18px" }}>Loading...</div>
    </div>
  );

  return (
    <>
      <Navbar profile={profile} />
      <div style={{
        minHeight: "calc(100vh - 80px)",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "20px",
        display: "flex",
        gap: "20px"
      }}>
        <Sidebar />
        
        {/* Main Content Area */}
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <div style={{
            background: "white",
            padding: "60px 40px",
            borderRadius: "20px",
            boxShadow: "0 15px 40px rgba(0,0,0,0.1)",
            textAlign: "center",
            maxWidth: "600px",
            width: "100%"
          }}>
            <h1 style={{
              color: "#333",
              fontSize: "42px",
              fontWeight: "700",
              margin: "0 0 20px 0"
            }}>Welcome, {profile?.name || "User"}!</h1>
            <p style={{
              color: "#666",
              fontSize: "20px",
              margin: "0 0 30px 0",
              lineHeight: "1.6"
            }}>We help you keep track of your money and suggest ways to improve your finances. Use the navigation on the left to get started.</p>
            
            <div style={{ display: "flex", gap: "15px", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => navigate('/dashboard')} style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white", border: "none", padding: "15px 25px", borderRadius: "12px",
                cursor: "pointer", fontSize: "16px", fontWeight: "600",
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.3)"
              }}>📈 View Dashboard</button>
              <button onClick={() => navigate('/analytics')} style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
                color: "white", border: "none", padding: "15px 25px", borderRadius: "12px",
                cursor: "pointer", fontSize: "16px", fontWeight: "600",
                boxShadow: "0 4px 15px rgba(139, 92, 246, 0.3)"
              }}>📊 View Analytics</button>
              <button onClick={() => navigate('/add-transaction')} style={{
                background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                color: "white", border: "none", padding: "15px 25px", borderRadius: "12px",
                cursor: "pointer", fontSize: "16px", fontWeight: "600",
                boxShadow: "0 4px 15px rgba(76, 175, 80, 0.3)"
              }}>+ Add Transaction</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;