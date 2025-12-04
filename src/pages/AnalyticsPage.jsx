import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Pie } from 'react-chartjs-2';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../services/api";
import '../Analytics.css';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function AnalyticsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('6months');
  const [showExportModal, setShowExportModal] = useState(false);
  const [analyticsData, setAnalyticsData] = useState({
    monthlySpending: { labels: [], data: [] },
    categoryBreakdown: { labels: [], data: [] },
    incomeVsExpenses: { labels: [], incomeData: [], expenseData: [] },
    summary: {
      totalIncome: 0,
      totalExpenses: 0,
      netSavings: 0,
      currentMonthIncome: 0,
      currentMonthExpenses: 0,
      topSpendingCategory: 'None'
    }
  });
  const navigate = useNavigate();

  const fetchAnalyticsData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch all analytics data
      const [monthlyRes, categoryRes, incomeVsExpenseRes, summaryRes] = await Promise.all([
        API.get('/analytics/monthly-spending', { headers }),
        API.get('/analytics/category-breakdown', { headers }),
        API.get('/analytics/income-vs-expenses', { headers }),
        API.get('/analytics/summary', { headers })
      ]);

      setAnalyticsData({
        monthlySpending: monthlyRes.data,
        categoryBreakdown: categoryRes.data,
        incomeVsExpenses: incomeVsExpenseRes.data,
        summary: summaryRes.data
      });
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      // Set fallback data if API fails
      setAnalyticsData({
        monthlySpending: { labels: [], data: [] },
        categoryBreakdown: { labels: [], data: [] },
        incomeVsExpenses: { labels: [], incomeData: [], expenseData: [] },
        summary: {
          totalIncome: 0,
          totalExpenses: 0,
          netSavings: 0,
          currentMonthIncome: 0,
          currentMonthExpenses: 0,
          topSpendingCategory: 'None'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Fetch profile
      API.get("/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => setProfile(res.data))
        .catch(err => {
          const username = localStorage.getItem('username') || 'User';
          setProfile({ name: username, email: 'user@example.com' });
        });

      // Fetch analytics data
      fetchAnalyticsData();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const monthlySpendingChartData = {
    labels: analyticsData.monthlySpending.labels || [],
    datasets: [
      {
        label: 'Monthly Spending',
        data: analyticsData.monthlySpending.data || [],
        borderColor: '#A084E8',
        backgroundColor: 'rgba(160, 132, 232, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const categoryChartData = {
    labels: analyticsData.categoryBreakdown.labels || [],
    datasets: [
      {
        data: analyticsData.categoryBreakdown.data || [],
        backgroundColor: [
          '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
          '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const incomeExpenseChartData = {
    labels: analyticsData.incomeVsExpenses.labels || [],
    datasets: [
      {
        label: 'Income',
        data: analyticsData.incomeVsExpenses.incomeData || [],
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
        borderWidth: 1,
      },
      {
        label: 'Expenses',
        data: analyticsData.incomeVsExpenses.expenseData || [],
        backgroundColor: '#FF6B6B',
        borderColor: '#FF6B6B',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const exportData = () => {
    const data = JSON.stringify(analyticsData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'financial-data.json';
    a.click();
    setShowExportModal(false);
  };

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
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "20px",
        display: "flex",
        gap: "20px"
      }}>
        <Sidebar />
        <div style={{ flex: 1, maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
            <div style={{ textAlign: "center", flex: 1 }}>
              <h1 style={{ color: "#333", margin: 0, fontSize: "28px", fontWeight: "700" }}>Financial Analytics Dashboard</h1>
              <p style={{ color: "#666", margin: "8px 0 0 0", fontSize: "16px" }}>
                Welcome back, {profile?.name || profile?.username || 'User'}! Here are your financial insights.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} style={{
                padding: "8px 12px", borderRadius: "6px", border: "1px solid #ddd",
                fontSize: "14px", background: "white"
              }}>
                <option value="1month">Last Month</option>
                <option value="3months">Last 3 Months</option>
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <button onClick={() => setShowExportModal(true)} style={{
                background: "#f8f9fa", color: "#333", border: "1px solid #ddd",
                padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "14px"
              }}>Export Data</button>
            </div>
          </div>
          
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px" }}>
              <div style={{ color: "#A084E8", fontSize: "18px" }}>Loading analytics...</div>
            </div>
          ) : (
            <>
              {/* Financial Health Overview */}
              <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "30px",
                borderRadius: "20px",
                color: "white",
                marginBottom: "25px",
                textAlign: "center"
              }}>
                <h2 style={{ margin: "0 0 20px 0", fontSize: "20px" }}>Financial Health Overview</h2>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
                  <div>
                    <div style={{ fontSize: "28px", fontWeight: "700", marginBottom: "5px" }}>₹{analyticsData.summary.totalIncome?.toFixed(0) || '0'}</div>
                    <div style={{ fontSize: "14px", opacity: 0.9 }}>Total Income</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "28px", fontWeight: "700", marginBottom: "5px" }}>₹{analyticsData.summary.totalExpenses?.toFixed(0) || '0'}</div>
                    <div style={{ fontSize: "14px", opacity: 0.9 }}>Total Expenses</div>
                  </div>
                  <div>
                    <div style={{ 
                      fontSize: "28px", 
                      fontWeight: "700", 
                      marginBottom: "5px",
                      color: (analyticsData.summary.netSavings || 0) >= 0 ? "#4CAF50" : "#FF6B6B"
                    }}>₹{analyticsData.summary.netSavings?.toFixed(0) || '0'}</div>
                    <div style={{ fontSize: "14px", opacity: 0.9 }}>{(analyticsData.summary.netSavings || 0) >= 0 ? "Net Savings" : "Deficit"}</div>
                  </div>
                </div>
              </div>

              {/* Advanced Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px", marginBottom: "25px" }}>
                <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                  <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>Savings Rate</h4>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#4CAF50" }}>
                    {analyticsData.summary.totalIncome > 0 ? (((analyticsData.summary.netSavings || 0) / analyticsData.summary.totalIncome) * 100).toFixed(1) : '0.0'}%
                  </div>
                </div>
                <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                  <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>This Month Expenses</h4>
                  <div style={{ fontSize: "24px", fontWeight: "700", color: "#FF6B6B" }}>
                    ₹{analyticsData.summary.currentMonthExpenses?.toFixed(0) || '0'}
                  </div>
                </div>
                <div style={{ background: "white", padding: "20px", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}>
                  <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>Top Category</h4>
                  <div style={{ fontSize: "18px", fontWeight: "700", color: "#FF9800" }}>
                    {analyticsData.summary.topSpendingCategory || 'None'}
                  </div>
                </div>
              </div>

              {/* Monthly Spending Trend */}
              <div style={{
                background: "white",
                padding: "25px",
                borderRadius: "16px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                marginBottom: "25px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                  <h3 style={{ color: "#333", margin: 0, fontSize: "18px" }}>Spending Trends Analysis</h3>
                  <button onClick={fetchAnalyticsData} style={{
                    background: "#f8f9fa", color: "#333", border: "1px solid #ddd",
                    padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px"
                  }}>Refresh</button>
                </div>
                <div style={{ height: "250px" }}>
                  <Line data={monthlySpendingChartData} options={chartOptions} />
                </div>
              </div>

              {/* Charts Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "16px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
                }}>
                  <h3 style={{ color: "#333", margin: "0 0 15px 0", fontSize: "18px" }}>Expense Distribution</h3>
                  <div style={{ height: "250px" }}>
                    <Pie data={categoryChartData} options={chartOptions} />
                  </div>
                </div>

                <div style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "16px",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.08)"
                }}>
                  <h3 style={{ color: "#333", margin: "0 0 15px 0", fontSize: "18px" }}>Income vs Expenses</h3>
                  <div style={{ height: "250px" }}>
                    <Bar data={incomeExpenseChartData} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* Financial Recommendations */}
              <div style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                padding: "25px",
                borderRadius: "16px",
                color: "white",
                marginTop: "25px"
              }}>
                <h3 style={{ margin: "0 0 15px 0", fontSize: "18px" }}>Financial Recommendations</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div style={{ background: "rgba(255,255,255,0.1)", padding: "15px", borderRadius: "12px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>Savings Optimization</div>
                    <div style={{ fontSize: "13px", opacity: 0.9 }}>
                      {analyticsData.summary.totalIncome > 0 && (analyticsData.summary.netSavings || 0) / analyticsData.summary.totalIncome > 0.2 
                        ? "Excellent savings rate! Consider investing surplus funds for better returns."
                        : "Try to increase your savings rate by reducing unnecessary expenses."}
                    </div>
                  </div>
                  <div style={{ background: "rgba(255,255,255,0.1)", padding: "15px", borderRadius: "12px" }}>
                    <div style={{ fontSize: "14px", fontWeight: "600", marginBottom: "5px" }}>Budget Allocation</div>
                    <div style={{ fontSize: "13px", opacity: 0.9 }}>
                      {analyticsData.summary.topSpendingCategory !== 'None' 
                        ? `Monitor ${analyticsData.summary.topSpendingCategory} expenses. Set monthly limits for better control.`
                        : "Start tracking your expenses by category to get better insights."}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{
                background: "white",
                padding: "25px",
                borderRadius: "16px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                marginTop: "25px"
              }}>
                <h3 style={{ color: "#333", margin: "0 0 15px 0", fontSize: "18px" }}>Quick Actions</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "15px" }}>
                  <button onClick={() => navigate('/add-transaction')} style={{
                    background: "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)",
                    color: "white", border: "none", padding: "15px", borderRadius: "12px",
                    cursor: "pointer", fontSize: "14px", fontWeight: "600"
                  }}>Add Transaction</button>
                  <button onClick={() => navigate('/expense-history')} style={{
                    background: "linear-gradient(135deg, #FF6B6B 0%, #FF5252 100%)",
                    color: "white", border: "none", padding: "15px", borderRadius: "12px",
                    cursor: "pointer", fontSize: "14px", fontWeight: "600"
                  }}>Expense History</button>
                  <button onClick={() => navigate('/income-history')} style={{
                    background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
                    color: "white", border: "none", padding: "15px", borderRadius: "12px",
                    cursor: "pointer", fontSize: "14px", fontWeight: "600"
                  }}>Income History</button>
                  <button onClick={() => navigate('/profile')} style={{
                    background: "linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)",
                    color: "white", border: "none", padding: "15px", borderRadius: "12px",
                    cursor: "pointer", fontSize: "14px", fontWeight: "600"
                  }}>Profile Settings</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000
        }}>
          <div style={{
            background: "white", padding: "30px", borderRadius: "16px", width: "400px", textAlign: "center"
          }}>
            <h3 style={{ margin: "0 0 20px 0", color: "#333" }}>Export Financial Data</h3>
            <p style={{ margin: "0 0 20px 0", color: "#666" }}>Download your financial data as JSON file</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={exportData} style={{
                background: "#4CAF50", color: "white", border: "none", padding: "12px 24px",
                borderRadius: "8px", cursor: "pointer", fontWeight: "500"
              }}>Download</button>
              <button onClick={() => setShowExportModal(false)} style={{
                background: "#ccc", color: "#333", border: "none", padding: "12px 24px",
                borderRadius: "8px", cursor: "pointer"
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AnalyticsPage;