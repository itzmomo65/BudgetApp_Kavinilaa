package com.infosys.service;

import com.infosys.config.JwtUtil;
import com.infosys.dto.TransactionRequest;
import com.infosys.model.Income;
import com.infosys.model.Expense;
import com.infosys.model.Budget;
import com.infosys.model.User;
import com.infosys.repository.IncomeRepository;
import com.infosys.repository.ExpenseRepository;
import com.infosys.repository.BudgetRepository;
import com.infosys.repository.SavingsGoalRepository;
import com.infosys.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.math.BigDecimal;

@Service
public class TransactionService {
    @Autowired
    private IncomeRepository incomeRepository;
    
    @Autowired
    private ExpenseRepository expenseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private BudgetRepository budgetRepository;
    
    @Autowired
    private SavingsGoalRepository savingsGoalRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    public String addTransaction(TransactionRequest request, String token) {
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("income".equals(request.getType())) {
            Income income = new Income();
            income.setAmount(request.getAmount());
            income.setDescription(request.getDescription());
            income.setCategory(request.getCategory());
            income.setTransactionDate(request.getDate());
            income.setUserId(user.getId());
            incomeRepository.save(income);
            
            // Removed automatic savings goal update - use manual savings transactions instead
            
            return "Income added successfully";
        } else if ("expense".equals(request.getType())) {
            Expense expense = new Expense();
            expense.setAmount(request.getAmount());
            expense.setDescription(request.getDescription());
            expense.setCategory(request.getCategory());
            expense.setTransactionDate(request.getDate());
            expense.setUserId(user.getId());
            expenseRepository.save(expense);
            
            // Update budget spending
            LocalDate transactionDate = request.getDate() != null ? LocalDate.parse(request.getDate()) : LocalDate.now();
            updateBudgetSpending(user.getId(), request.getCategory(), BigDecimal.valueOf(request.getAmount()), transactionDate);
            
            return "Expense added successfully";
        } else {
            throw new RuntimeException("Invalid transaction type");
        }
    }

    public java.util.List<Income> getIncomes(String token) {
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return incomeRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public java.util.List<Expense> getExpenses(String token) {
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return expenseRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    public String updateTransaction(String type, Long id, TransactionRequest request, String token) {
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("income".equals(type)) {
            Income income = incomeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Income not found"));
            if (!income.getUserId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized");
            }
            BigDecimal oldAmount = BigDecimal.valueOf(income.getAmount());
            String oldDescription = income.getDescription();
            
            income.setAmount(request.getAmount());
            income.setDescription(request.getDescription());
            income.setCategory(request.getCategory());
            incomeRepository.save(income);
            
            // Removed automatic savings goal update - use manual savings transactions instead
            
            return "Income updated successfully";
        } else if ("expense".equals(type)) {
            Expense expense = expenseRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Expense not found"));
            if (!expense.getUserId().equals(user.getId())) {
                throw new RuntimeException("Unauthorized");
            }
            BigDecimal oldAmount = BigDecimal.valueOf(expense.getAmount());
            String oldCategory = expense.getCategory();
            LocalDate oldDate = expense.getTransactionDate() != null ? LocalDate.parse(expense.getTransactionDate()) : LocalDate.now();
            
            expense.setAmount(request.getAmount());
            expense.setDescription(request.getDescription());
            expense.setCategory(request.getCategory());
            expenseRepository.save(expense);
            
            // Revert old budget spending and add new
            revertBudgetSpending(user.getId(), oldCategory, oldAmount, oldDate);
            LocalDate newTransactionDate = request.getDate() != null ? LocalDate.parse(request.getDate()) : LocalDate.now();
            updateBudgetSpending(user.getId(), request.getCategory(), BigDecimal.valueOf(request.getAmount()), newTransactionDate);
            
            return "Expense updated successfully";
        } else {
            throw new RuntimeException("Invalid transaction type");
        }
    }

    public String deleteTransaction(String type, Long id, String token) {
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if ("income".equals(type)) {
            Income income = incomeRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Income not found"));
            
            // Removed automatic savings goal update - use manual savings transactions instead
            
            incomeRepository.deleteById(id);
            return "Income deleted successfully";
        } else if ("expense".equals(type)) {
            Expense expense = expenseRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Expense not found"));
            
            // Revert budget spending
            LocalDate expenseDate = expense.getTransactionDate() != null ? LocalDate.parse(expense.getTransactionDate()) : LocalDate.now();
            revertBudgetSpending(user.getId(), expense.getCategory(), BigDecimal.valueOf(expense.getAmount()), expenseDate);
            
            expenseRepository.deleteById(id);
            return "Expense deleted successfully";
        } else {
            throw new RuntimeException("Invalid transaction type");
        }
    }
    
    private void updateBudgetSpending(Long userId, String category, BigDecimal amount, LocalDate transactionDate) {
        int month = transactionDate.getMonthValue();
        int year = transactionDate.getYear();
        
        System.out.println("Updating budget - User: " + userId + ", Category: " + category + ", Amount: " + amount + ", Month: " + month + ", Year: " + year);
        
        budgetRepository.findByUserIdAndCategoryAndMonthAndYear(userId, category, month, year)
            .ifPresentOrElse(budget -> {
                BigDecimal oldSpent = budget.getSpentAmount();
                budget.setSpentAmount(budget.getSpentAmount().add(amount));
                budgetRepository.save(budget);
                System.out.println("Budget updated - Old spent: " + oldSpent + ", New spent: " + budget.getSpentAmount());
            }, () -> {
                System.out.println("No budget found for category: " + category + ", month: " + month + ", year: " + year);
            });
    }
    
    private void revertBudgetSpending(Long userId, String category, BigDecimal amount, LocalDate transactionDate) {
        int month = transactionDate.getMonthValue();
        int year = transactionDate.getYear();
        
        budgetRepository.findByUserIdAndCategoryAndMonthAndYear(userId, category, month, year)
            .ifPresent(budget -> {
                budget.setSpentAmount(budget.getSpentAmount().subtract(amount));
                budgetRepository.save(budget);
            });
    }
    
    private void updateSavingsGoals(Long userId, String description, BigDecimal amount) {
        savingsGoalRepository.findByUserId(userId).forEach(goal -> {
            if (goal.getGoalName().toLowerCase().contains(description.toLowerCase()) || 
                description.toLowerCase().contains(goal.getGoalName().toLowerCase())) {
                
                BigDecimal oldAmount = goal.getCurrentAmount();
                goal.setCurrentAmount(goal.getCurrentAmount().add(amount));
                savingsGoalRepository.save(goal);
                
                System.out.println("Updated savings goal '" + goal.getGoalName() + "' - Old: " + 
                    oldAmount + ", New: " + goal.getCurrentAmount());
            }
        });
    }
    
    private void revertSavingsGoals(Long userId, String description, BigDecimal amount) {
        savingsGoalRepository.findByUserId(userId).forEach(goal -> {
            if (goal.getGoalName().toLowerCase().contains(description.toLowerCase()) || 
                description.toLowerCase().contains(goal.getGoalName().toLowerCase())) {
                
                goal.setCurrentAmount(goal.getCurrentAmount().subtract(amount));
                if (goal.getCurrentAmount().compareTo(BigDecimal.ZERO) < 0) {
                    goal.setCurrentAmount(BigDecimal.ZERO);
                }
                savingsGoalRepository.save(goal);
                
                System.out.println("Reverted savings goal '" + goal.getGoalName() + "': " + goal.getCurrentAmount());
            }
        });
    }
}