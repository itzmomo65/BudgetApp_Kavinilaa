import API from '../services/api';

export const generateSampleData = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Please login first');
    return;
  }

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const sampleTransactions = [
    // Current month expenses
    { amount: 500, description: 'Groceries', type: 'expense', category: 'Food', date: new Date(currentYear, currentMonth, 15).toISOString().split('T')[0] },
    { amount: 200, description: 'Gas', type: 'expense', category: 'Transportation', date: new Date(currentYear, currentMonth, 14).toISOString().split('T')[0] },
    { amount: 150, description: 'Movie night', type: 'expense', category: 'Entertainment', date: new Date(currentYear, currentMonth, 13).toISOString().split('T')[0] },
    { amount: 300, description: 'Clothes shopping', type: 'expense', category: 'Shopping', date: new Date(currentYear, currentMonth, 12).toISOString().split('T')[0] },
    { amount: 800, description: 'Electricity bill', type: 'expense', category: 'Bills', date: new Date(currentYear, currentMonth, 10).toISOString().split('T')[0] },
    { amount: 250, description: 'Doctor visit', type: 'expense', category: 'Healthcare', date: new Date(currentYear, currentMonth, 8).toISOString().split('T')[0] },
    
    // Current month income
    { amount: 5000, description: 'Monthly salary', type: 'income', category: 'Salary', date: new Date(currentYear, currentMonth, 1).toISOString().split('T')[0] },
    { amount: 1000, description: 'Freelance project', type: 'income', category: 'Freelance', date: new Date(currentYear, currentMonth, 5).toISOString().split('T')[0] },
    
    // Previous months for trends
    { amount: 450, description: 'Groceries', type: 'expense', category: 'Food', date: new Date(currentYear, currentMonth-1, 15).toISOString().split('T')[0] },
    { amount: 180, description: 'Gas', type: 'expense', category: 'Transportation', date: new Date(currentYear, currentMonth-1, 14).toISOString().split('T')[0] },
    { amount: 120, description: 'Concert', type: 'expense', category: 'Entertainment', date: new Date(currentYear, currentMonth-1, 13).toISOString().split('T')[0] },
    { amount: 4800, description: 'Monthly salary', type: 'income', category: 'Salary', date: new Date(currentYear, currentMonth-1, 1).toISOString().split('T')[0] },
    
    { amount: 520, description: 'Groceries', type: 'expense', category: 'Food', date: new Date(currentYear, currentMonth-2, 15).toISOString().split('T')[0] },
    { amount: 220, description: 'Gas', type: 'expense', category: 'Transportation', date: new Date(currentYear, currentMonth-2, 14).toISOString().split('T')[0] },
    { amount: 4800, description: 'Monthly salary', type: 'income', category: 'Salary', date: new Date(currentYear, currentMonth-2, 1).toISOString().split('T')[0] },
    
    { amount: 480, description: 'Groceries', type: 'expense', category: 'Food', date: new Date(currentYear, currentMonth-3, 15).toISOString().split('T')[0] },
    { amount: 190, description: 'Gas', type: 'expense', category: 'Transportation', date: new Date(currentYear, currentMonth-3, 14).toISOString().split('T')[0] },
    { amount: 4800, description: 'Monthly salary', type: 'income', category: 'Salary', date: new Date(currentYear, currentMonth-3, 1).toISOString().split('T')[0] },
  ];

  try {
    console.log('Generating sample transactions:', sampleTransactions.length);
    let successCount = 0;
    
    for (const transaction of sampleTransactions) {
      try {
        await API.post('/transactions', transaction, {
          headers: { Authorization: `Bearer ${token}` }
        });
        successCount++;
      } catch (err) {
        console.error('Failed to create transaction:', transaction, err);
      }
    }
    
    console.log(`Successfully created ${successCount} transactions`);
    return successCount;
  } catch (error) {
    console.error('Error generating sample data:', error);
    throw error;
  }
};