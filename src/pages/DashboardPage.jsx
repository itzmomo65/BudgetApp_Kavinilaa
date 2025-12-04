import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import '../Analytics.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function DashboardPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, net: 0, savingsRate: 0 });
  const [categoryData, setCategoryData] = useState(null);
  const [last6MonthsData, setLast6MonthsData] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/login');
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      
      // Fetch profile
      try {
        const profileRes = await API.get("/user/profile", { headers });
        setProfile(profileRes.data);
      } catch (err) {
        const username = localStorage.getItem('username') || 'User';
        setProfile({ name: username, username, email: 'user@example.com' });
      }

      // Fetch analytics data
      const [summaryRes, categoryRes, incomeVsExpenseRes, incomesRes, expensesRes] = await Promise.all([
        API.get('/analytics/summary', { headers }),
        API.get('/analytics/category-breakdown', { headers }),
        API.get('/analytics/income-vs-expenses', { headers }),
        API.get('/transactions/incomes', { headers }),
        API.get('/transactions/expenses', { headers })
      ]);

      // Process summary data
      const summaryData = summaryRes.data;
      setSummary({
        income: summaryData.totalIncome || 0,
        expenses: summaryData.totalExpenses || 0,
        net: summaryData.netSavings || 0,
        savingsRate: summaryData.totalIncome > 0 ? ((summaryData.netSavings || 0) / summaryData.totalIncome * 100).toFixed(1) : 0
      });

      // Process category data for pie chart
      const categoryBreakdown = categoryRes.data;
      if (categoryBreakdown.labels && categoryBreakdown.labels.length > 0) {
        setCategoryData({
          labels: categoryBreakdown.labels,
          datasets: [{
            data: categoryBreakdown.data,
            backgroundColor: ['#10b981', '#ef4444', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'],
            borderColor: 'white',
            borderWidth: 2
          }]
        });
      }

      // Process 6-month data for line chart
      const incomeVsExpense = incomeVsExpenseRes.data;
      if (incomeVsExpense.labels && incomeVsExpense.labels.length > 0) {
        setLast6MonthsData({
          labels: incomeVsExpense.labels,
          datasets: [
            {
              label: 'Income',
              data: incomeVsExpense.incomeData,
              borderColor: '#10b981',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 5,
              pointBackgroundColor: '#10b981',
              pointBorderColor: 'white',
              pointBorderWidth: 2
            },
            {
              label: 'Expenses',
              data: incomeVsExpense.expenseData,
              borderColor: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              pointRadius: 5,
              pointBackgroundColor: '#ef4444',
              pointBorderColor: 'white',
              pointBorderWidth: 2
            }
          ]
        });
      }

      // Combine and sort recent transactions
      const allTransactions = [
        ...incomesRes.data.map(t => ({ ...t, type: 'income', date: t.transactionDate })),
        ...expensesRes.data.map(t => ({ ...t, type: 'expense', date: t.transactionDate }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
      
      setTransactions(allTransactions);

      // Generate AI insights
      generateAIInsights(summaryData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = (summaryData) => {
    const insights = [];
    const savingsRate = summaryData.totalIncome > 0 ? (summaryData.netSavings || 0) / summaryData.totalIncome : 0;
    
    if (savingsRate > 0.2) {
      insights.push('Excellent savings rate! Consider investing surplus funds for better returns.');
    } else if (savingsRate > 0.1) {
      insights.push('Good savings habit. Try to increase your savings rate to 20% for better financial health.');
    } else {
      insights.push('Consider reducing expenses to improve your savings rate.');
    }

    if (summaryData.currentMonthExpenses > summaryData.currentMonthIncome) {
      insights.push('This month expenses exceed income. Review your spending patterns.');
    }

    if (summaryData.topSpendingCategory && summaryData.topSpendingCategory !== 'None') {
      insights.push(`Monitor ${summaryData.topSpendingCategory} expenses. Set monthly limits for better control.`);
    }

    setAiInsights(insights.slice(0, 3));
  };

  useEffect(() => {
    fetchData();
  }, [navigate]);

  if (!profile) return (
    <div className="loading-container">
      <div className="loading-text">Loading...</div>
    </div>
  );

  return (
    <>
      <Navbar profile={profile} />
      <div className="analytics-page">
        <Sidebar />
        <div className="analytics-content">
          {/* Welcome Header */}
          <div style={{ marginBottom: '30px' }}>
            <h1 style={{ marginBottom: 4, fontSize: '32px', fontWeight: '700', color: '#333' }}>
              Welcome, {profile?.username || profile?.name || 'User'}! 👋
            </h1>
            <p style={{ color: '#6b7280', fontSize: 14 }}>Here's your financial overview</p>
          </div>

          {/* Summary Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px'
          }}>
            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>TOTAL INCOME</span>
                <span style={{ fontSize: '20px' }}>📈</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>₹{summary.income.toFixed(2)}</div>
              <div style={{ fontSize: '12px', color: '#10b981', marginTop: '5px' }}>📊 Financial inflow</div>
            </div>

            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>TOTAL EXPENSES</span>
                <span style={{ fontSize: '20px' }}>💸</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444' }}>₹{summary.expenses.toFixed(2)}</div>
              <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '5px' }}>📉 Money spent</div>
            </div>

            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>NET SAVINGS</span>
                <span style={{ fontSize: '20px' }}>💰</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: summary.net >= 0 ? '#10b981' : '#ef4444' }}>
                ₹{summary.net.toFixed(2)}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>📈 {summary.savingsRate}% savings rate</div>
            </div>

            <div style={{
              background: 'white',
              padding: '30px',
              borderRadius: '16px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              textAlign: 'center'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#6b7280' }}>ACTIVE GOALS</span>
                <span style={{ fontSize: '20px' }}>🎯</span>
              </div>
              <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6' }}>1</div>
              <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>Managing targets</div>
            </div>
          </div>

          {/* Charts Section */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '25px' }}>
            {/* 6-Month Line Chart */}
            <div className="chart-card">
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#333' }}>Income vs Expenses (Last 6 Months)</h3>
              {last6MonthsData ? (
                <Line 
                  data={last6MonthsData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                          font: { size: 13, weight: 500 },
                          color: '#6b7280',
                          padding: 15,
                          usePointStyle: true
                        }
                      }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          color: '#9ca3af',
                          font: { size: 12 },
                          callback: function(value) {
                            return '₹' + value.toLocaleString();
                          }
                        },
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                      },
                      x: {
                        grid: { display: false },
                        ticks: { color: '#9ca3af', font: { size: 12 } }
                      }
                    }
                  }}
                  height={300}
                />
              ) : (
                <div className="no-data">No data available</div>
              )}
            </div>

            {/* Spending by Category Pie Chart */}
            <div className="chart-card">
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#333' }}>Spending by Category</h3>
              {categoryData && categoryData.labels.length > 0 ? (
                <Pie 
                  data={categoryData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        display: true,
                        position: 'bottom',
                        labels: {
                          font: { size: 11, weight: 500 },
                          color: '#6b7280',
                          padding: 10,
                          usePointStyle: true
                        }
                      },
                      tooltip: {
                        callbacks: {
                          label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ₹${context.parsed.toFixed(0)} (${percentage}%)`;
                          }
                        }
                      }
                    }
                  }}
                  height={300}
                />
              ) : (
                <div className="no-data">No expense data available</div>
              )}
            </div>
          </div>

          {/* Recent Transactions & AI Insights */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="chart-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>Recent Transactions</h3>
                <button onClick={() => navigate('/transactions')} style={{
                  color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: '14px', fontWeight: 500
                }}>View All</button>
              </div>
              <div>
                {loading && <div style={{color:'#6b7280'}}>Loading transactions...</div>}
                {!loading && transactions.length === 0 && <div style={{color:'#6b7280'}}>No transactions yet</div>}
                {!loading && transactions.map(txn => (
                  <div key={txn.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0', borderBottom: '1px solid #f3f4f6'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px', height: '40px', borderRadius: '50%', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                        backgroundColor: txn.type === 'income' ? '#d1fae5' : '#fee2e2',
                        color: txn.type === 'income' ? '#10b981' : '#ef4444'
                      }}>
                        {txn.type === 'income' ? '⊕' : '⊖'}
                      </div>
                      <div>
                        <div style={{fontWeight:600, color: '#1f2937', fontSize: '14px'}}>{txn.description}</div>
                        <div style={{fontSize:12, color:'#9ca3af'}}>
                          {new Date(txn.date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{
                        fontWeight:700, 
                        color: txn.type === 'income' ? '#10b981' : '#ef4444',
                        fontSize: '14px'
                      }}>
                        {txn.type === 'income' ? '+' : '-'}₹{parseFloat(txn.amount).toFixed(2)}
                      </div>
                      <div style={{fontSize: '12px', color: '#9ca3af', fontWeight: 500}}>{txn.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Financial Insights */}
            <div className="chart-card">
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#333' }}>✨ AI Financial Insights</h3>
              <div>
                {aiInsights.length > 0 ? aiInsights.map((insight, index) => (
                  <div key={index} style={{
                    display: 'flex', gap: '12px', padding: '15px 0',
                    borderBottom: index < aiInsights.length - 1 ? '1px solid #f3f4f6' : 'none'
                  }}>
                    <span style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: '#667eea', color: 'white', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '600'
                    }}>{index + 1}</span>
                    <p style={{ margin: 0, fontSize: '14px', color: '#4b5563', lineHeight: '1.5' }}>{insight}</p>
                  </div>
                )) : (
                  <div style={{ display: 'flex', gap: '12px', padding: '15px 0' }}>
                    <span style={{ fontSize: '20px' }}>💡</span>
                    <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>Loading personalized insights based on your spending patterns...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}