import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function TransactionsPage() {
  const [profile, setProfile] = useState(null);
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editForm, setEditForm] = useState({ amount: "", description: "", category: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTransactions = () => {
    const token = localStorage.getItem("token");
    if (token) {
      API.get("/transactions/incomes", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setIncomes(res.data))
        .catch(err => console.log("Failed to fetch incomes"));

      API.get("/transactions/expenses", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setExpenses(res.data))
        .catch(err => console.log("Failed to fetch expenses"));
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch profile
      API.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setProfile(res.data))
        .catch(err => setProfile({ name: "User", email: "user@example.com" }));

      // Fetch transactions
      fetchTransactions();
    }
  }, []);

  const handleEdit = (transaction, type) => {
    setEditingTransaction({ ...transaction, type });
    setEditForm({
      amount: transaction.amount.toString(),
      description: transaction.description,
      category: transaction.category
    });
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.put(`/transactions/${editingTransaction.type}/${editingTransaction.id}`, {
        amount: parseFloat(editForm.amount),
        description: editForm.description,
        category: editForm.category
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess("Transaction updated successfully!");
      setEditingTransaction(null);
      fetchTransactions();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update transaction");
      setTimeout(() => setError(""), 3000);
    }
  };

  const handleDelete = async (id, type) => {
    if (window.confirm("Are you sure you want to delete this transaction?")) {
      try {
        const token = localStorage.getItem("token");
        console.log(`Deleting ${type} with ID: ${id}`);
        const response = await API.delete(`/transactions/${type}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Delete response:", response.data);
        setSuccess("Transaction deleted successfully!");
        fetchTransactions();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error("Delete error:", err);
        const errorMessage = err.response?.data?.message || err.response?.data || "Failed to delete transaction";
        setError(errorMessage);
        setTimeout(() => setError(""), 3000);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
    setEditForm({ amount: "", description: "", category: "" });
  };

  const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const balance = totalIncome - totalExpense;

  if (!profile) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ color: "#A084E8", fontSize: "18px" }}>Loading...</div>
    </div>
  );

  return (
    <>
      <Navbar profile={profile} />
      <div style={{
        minHeight: "calc(100vh - 80px)",
        background: "linear-gradient(135deg, #E7DDFF 0%, #F5F2FF 50%, #FFFFFF 100%)",
        padding: "20px",
        display: "flex",
        gap: "20px"
      }}>
        <Sidebar />
        <div style={{ flex: 1, maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1 style={{ color: "#4A4A4A", fontSize: "32px", fontWeight: "700", margin: "0 0 8px 0" }}>
              Transaction Dashboard
            </h1>
            <p style={{ color: "#8B8B8B", margin: 0 }}>Track your income and expenses</p>
          </div>

          {success && (
            <div style={{
              background: "rgba(0, 184, 148, 0.1)",
              color: "#00B894",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              textAlign: "center"
            }}>{success}</div>
          )}

          {error && (
            <div style={{
              background: "rgba(255, 107, 107, 0.1)",
              color: "#D63031",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              textAlign: "center"
            }}>{error}</div>
          )}

          {/* Summary Cards */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "40px"
          }}>
            <div style={{
              background: "rgba(0, 184, 148, 0.1)",
              padding: "30px",
              borderRadius: "16px",
              border: "2px solid rgba(0, 184, 148, 0.2)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "18px", marginBottom: "10px", fontWeight: "bold", color: "#00B894" }}>+</div>
              <h3 style={{ color: "#00B894", margin: "0 0 8px 0" }}>Total Income</h3>
              <p style={{ color: "#00B894", fontSize: "24px", fontWeight: "700", margin: 0 }}>
                ₹{totalIncome.toFixed(2)}
              </p>
            </div>

            <div style={{
              background: "rgba(255, 107, 107, 0.1)",
              padding: "30px",
              borderRadius: "16px",
              border: "2px solid rgba(255, 107, 107, 0.2)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "18px", marginBottom: "10px", fontWeight: "bold", color: "#FF6B6B" }}>-</div>
              <h3 style={{ color: "#FF6B6B", margin: "0 0 8px 0" }}>Total Expenses</h3>
              <p style={{ color: "#FF6B6B", fontSize: "24px", fontWeight: "700", margin: 0 }}>
                ₹{totalExpense.toFixed(2)}
              </p>
            </div>

            <div style={{
              background: "rgba(160, 132, 232, 0.1)",
              padding: "30px",
              borderRadius: "16px",
              border: "2px solid rgba(160, 132, 232, 0.2)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "18px", marginBottom: "10px", fontWeight: "bold", color: "#A084E8" }}>=</div>
              <h3 style={{ color: "#A084E8", margin: "0 0 8px 0" }}>Balance</h3>
              <p style={{ 
                color: balance >= 0 ? "#00B894" : "#FF6B6B", 
                fontSize: "24px", 
                fontWeight: "700", 
                margin: 0 
              }}>
                ₹{balance.toFixed(2)}
              </p>
            </div>
          </div>

          {/* History Navigation Buttons */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
            gap: "40px",
            maxWidth: "900px",
            margin: "0 auto 40px auto"
          }}>
            <button
              onClick={() => navigate("/income-history")}
              style={{
                background: "linear-gradient(135deg, #00B894, #00A085)",
                color: "white",
                padding: "40px 50px",
                border: "none",
                borderRadius: "24px",
                fontSize: "24px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 15px 35px rgba(0, 184, 148, 0.4)",
                transition: "all 0.3s ease",
                textAlign: "center",
                minHeight: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 184, 148, 0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(0, 184, 148, 0.4)";
              }}
            >
              Income History
            </button>
            
            <button
              onClick={() => navigate("/expense-history")}
              style={{
                background: "linear-gradient(135deg, #FF6B6B, #FF5252)",
                color: "white",
                padding: "40px 50px",
                border: "none",
                borderRadius: "24px",
                fontSize: "24px",
                fontWeight: "700",
                cursor: "pointer",
                boxShadow: "0 15px 35px rgba(255, 107, 107, 0.4)",
                transition: "all 0.3s ease",
                textAlign: "center",
                minHeight: "120px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(255, 107, 107, 0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 15px 35px rgba(255, 107, 107, 0.4)";
              }}
            >
              Expense History
            </button>
          </div>

          {/* Action Buttons */}
          <div style={{ textAlign: "center", display: "flex", gap: "20px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/add-transaction")}
              style={{
                background: "linear-gradient(135deg, #E7DDFF 0%, #D4C5FF 100%)",
                color: "#4A4A4A",
                padding: "16px 32px",
                border: "none",
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(231, 221, 255, 0.4)"
              }}
            >
              + Add New Transaction
            </button>
            <button
              onClick={() => navigate("/analytics")}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                padding: "16px 32px",
                border: "none",
                borderRadius: "16px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                boxShadow: "0 8px 20px rgba(102, 126, 234, 0.4)"
              }}
            >
              📊 View Analytics
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default TransactionsPage;