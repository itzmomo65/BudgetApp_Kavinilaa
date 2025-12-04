import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Sidebar() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const navigate = useNavigate();

  return (
    <div 
      style={{
        width: sidebarExpanded ? "280px" : "80px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        transition: "width 0.3s ease",
        position: "relative",
        flexShrink: 0
      }}
    >
      {/* Menu Header */}
      <div 
        onClick={() => setSidebarExpanded(!sidebarExpanded)}
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          textAlign: "center",
          marginBottom: "10px",
          cursor: "pointer"
        }}>
        <div style={{
          fontSize: "18px",
          color: "#A084E8",
          fontWeight: "bold"
        }}>☰</div>
        {sidebarExpanded && (
          <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: "14px" }}>Menu</p>
        )}
      </div>

      {/* Add Transaction */}
      <div
        onClick={() => navigate("/add-transaction")}
        style={{
          background: "white",
          padding: sidebarExpanded ? "20px" : "15px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          justifyContent: sidebarExpanded ? "flex-start" : "center"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(231, 221, 255, 0.3)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        }}
      >
        <div style={{
          width: "40px",
          height: "40px",
          background: "linear-gradient(135deg, #E7DDFF, #D4C5FF)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "white",
          fontWeight: "bold",
          flexShrink: 0
        }}>+</div>
        {sidebarExpanded && (
          <div>
            <h3 style={{ color: "#A084E8", margin: "0 0 5px 0", fontSize: "16px" }}>Add Transaction</h3>
            <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>Record income and expenses</p>
          </div>
        )}
      </div>

      {/* Transactions */}
      <div
        onClick={() => navigate("/transactions")}
        style={{
          background: "white",
          padding: sidebarExpanded ? "20px" : "15px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          justifyContent: sidebarExpanded ? "flex-start" : "center"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(231, 221, 255, 0.3)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        }}
      >
        <div style={{
          width: "40px",
          height: "40px",
          background: "linear-gradient(135deg, #E7DDFF, #D4C5FF)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "white",
          fontWeight: "bold",
          flexShrink: 0
        }}>=</div>
        {sidebarExpanded && (
          <div>
            <h3 style={{ color: "#A084E8", margin: "0 0 5px 0", fontSize: "16px" }}>Transactions</h3>
            <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>View income and expenses</p>
          </div>
        )}
      </div>

      {/* Budget */}
      <div
        onClick={() => navigate("/budget")}
        style={{
          background: "white",
          padding: sidebarExpanded ? "20px" : "15px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          justifyContent: sidebarExpanded ? "flex-start" : "center"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(231, 221, 255, 0.3)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        }}
      >
        <div style={{
          width: "40px",
          height: "40px",
          background: "linear-gradient(135deg, #E7DDFF, #D4C5FF)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "white",
          fontWeight: "bold",
          flexShrink: 0
        }}>₹</div>
        {sidebarExpanded && (
          <div>
            <h3 style={{ color: "#A084E8", margin: "0 0 5px 0", fontSize: "16px" }}>Budget</h3>
            <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>Manage monthly budgets</p>
          </div>
        )}
      </div>

      {/* Savings Goals */}
      <div
        onClick={() => navigate("/savings")}
        style={{
          background: "white",
          padding: sidebarExpanded ? "20px" : "15px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          justifyContent: sidebarExpanded ? "flex-start" : "center"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(231, 221, 255, 0.3)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        }}
      >
        <div style={{
          width: "40px",
          height: "40px",
          background: "linear-gradient(135deg, #E7DDFF, #D4C5FF)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "white",
          fontWeight: "bold",
          flexShrink: 0
        }}>★</div>
        {sidebarExpanded && (
          <div>
            <h3 style={{ color: "#A084E8", margin: "0 0 5px 0", fontSize: "16px" }}>Savings Goals</h3>
            <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>Track and manage savings goals</p>
          </div>
        )}
      </div>

      {/* Dashboard */}
      <div
        onClick={() => navigate("/dashboard")}
        style={{
          background: "white",
          padding: sidebarExpanded ? "20px" : "15px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          justifyContent: sidebarExpanded ? "flex-start" : "center"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(231, 221, 255, 0.3)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        }}
      >
        <div style={{
          width: "40px",
          height: "40px",
          background: "linear-gradient(135deg, #E7DDFF, #D4C5FF)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "white",
          fontWeight: "bold",
          flexShrink: 0
        }}>📈</div>
        {sidebarExpanded && (
          <div>
            <h3 style={{ color: "#A084E8", margin: "0 0 5px 0", fontSize: "16px" }}>Dashboard</h3>
            <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>Financial overview</p>
          </div>
        )}
      </div>

      {/* Analytics */}
      <div
        onClick={() => navigate("/analytics")}
        style={{
          background: "white",
          padding: sidebarExpanded ? "20px" : "15px",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          cursor: "pointer",
          transition: "all 0.3s ease",
          display: "flex",
          alignItems: "center",
          gap: "15px",
          justifyContent: sidebarExpanded ? "flex-start" : "center"
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.boxShadow = "0 8px 20px rgba(231, 221, 255, 0.3)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
        }}
      >
        <div style={{
          width: "40px",
          height: "40px",
          background: "linear-gradient(135deg, #E7DDFF, #D4C5FF)",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "18px",
          color: "white",
          fontWeight: "bold",
          flexShrink: 0
        }}>📊</div>
        {sidebarExpanded && (
          <div>
            <h3 style={{ color: "#A084E8", margin: "0 0 5px 0", fontSize: "16px" }}>Analytics</h3>
            <p style={{ color: "#666", margin: 0, fontSize: "12px" }}>Detailed financial analysis</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;