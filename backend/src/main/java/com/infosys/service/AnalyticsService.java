package com.infosys.service;

import com.infosys.model.User;
import com.infosys.model.Income;
import com.infosys.model.Expense;
import com.infosys.repository.UserRepository;
import com.infosys.repository.IncomeRepository;
import com.infosys.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private IncomeRepository incomeRepository;
    
    @Autowired
    private ExpenseRepository expenseRepository;

    public Map<String, Object> getMonthlySpendingData(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Expense> expenses = expenseRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        
        System.out.println("Found " + expenses.size() + " expenses for user: " + email);
        
        Map<String, Double> monthlySpending = new LinkedHashMap<>();
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        
        // Initialize last 6 months with 0
        for (int i = 5; i >= 0; i--) {
            LocalDate month = LocalDate.now().minusMonths(i);
            String monthKey = month.format(DateTimeFormatter.ofPattern("MMM yyyy"));
            monthlySpending.put(monthKey, 0.0);
        }
        
        // Aggregate expenses by month
        int processedCount = 0;
        for (Expense expense : expenses) {
            LocalDate expenseDate = parseDate(expense.getTransactionDate());
            String monthKey = expenseDate.format(DateTimeFormatter.ofPattern("MMM yyyy"));
            monthlySpending.merge(monthKey, expense.getAmount(), Double::sum);
            processedCount++;
        }
        
        System.out.println("Processed " + processedCount + " expenses");
        System.out.println("Monthly spending data: " + monthlySpending);
        
        Map<String, Object> result = new HashMap<>();
        result.put("labels", new ArrayList<>(monthlySpending.keySet()));
        result.put("data", new ArrayList<>(monthlySpending.values()));
        return result;
    }

    public Map<String, Object> getCategoryBreakdownData(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Expense> expenses = expenseRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        
        System.out.println("Category breakdown - Found " + expenses.size() + " expenses for user: " + email);
        
        Map<String, Double> categorySpending = new HashMap<>();
        
        for (Expense expense : expenses) {
            categorySpending.merge(expense.getCategory(), expense.getAmount(), Double::sum);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("labels", new ArrayList<>(categorySpending.keySet()));
        result.put("data", new ArrayList<>(categorySpending.values()));
        return result;
    }

    public Map<String, Object> getIncomeVsExpensesData(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Income> incomes = incomeRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<Expense> expenses = expenseRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        
        System.out.println("Income vs Expenses - Found " + incomes.size() + " incomes and " + expenses.size() + " expenses");
        
        Map<String, Double> monthlyIncome = new LinkedHashMap<>();
        Map<String, Double> monthlyExpenses = new LinkedHashMap<>();
        LocalDate sixMonthsAgo = LocalDate.now().minusMonths(6);
        
        // Initialize last 6 months
        for (int i = 5; i >= 0; i--) {
            LocalDate month = LocalDate.now().minusMonths(i);
            String monthKey = month.format(DateTimeFormatter.ofPattern("MMM yyyy"));
            monthlyIncome.put(monthKey, 0.0);
            monthlyExpenses.put(monthKey, 0.0);
        }
        
        // Aggregate income by month
        for (Income income : incomes) {
            LocalDate incomeDate = parseDate(income.getTransactionDate());
            String monthKey = incomeDate.format(DateTimeFormatter.ofPattern("MMM yyyy"));
            monthlyIncome.merge(monthKey, income.getAmount(), Double::sum);
        }
        
        // Aggregate expenses by month
        for (Expense expense : expenses) {
            LocalDate expenseDate = parseDate(expense.getTransactionDate());
            String monthKey = expenseDate.format(DateTimeFormatter.ofPattern("MMM yyyy"));
            monthlyExpenses.merge(monthKey, expense.getAmount(), Double::sum);
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("labels", new ArrayList<>(monthlyIncome.keySet()));
        result.put("incomeData", new ArrayList<>(monthlyIncome.values()));
        result.put("expenseData", new ArrayList<>(monthlyExpenses.values()));
        return result;
    }

    public Map<String, Object> getSummaryData(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        List<Income> incomes = incomeRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        List<Expense> expenses = expenseRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        
        System.out.println("Found " + incomes.size() + " incomes and " + expenses.size() + " expenses for user: " + email);
        
        LocalDate currentMonth = LocalDate.now().withDayOfMonth(1);
        
        double totalIncome = incomes.stream().mapToDouble(Income::getAmount).sum();
        double totalExpenses = expenses.stream().mapToDouble(Expense::getAmount).sum();
        
        // Filter current month transactions
        double currentMonthIncome = incomes.stream()
            .filter(income -> {
                LocalDate incomeDate = parseDate(income.getTransactionDate());
                return incomeDate.getYear() == currentMonth.getYear() && 
                       incomeDate.getMonth() == currentMonth.getMonth();
            })
            .mapToDouble(Income::getAmount).sum();
            
        double currentMonthExpenses = expenses.stream()
            .filter(expense -> {
                LocalDate expenseDate = parseDate(expense.getTransactionDate());
                return expenseDate.getYear() == currentMonth.getYear() && 
                       expenseDate.getMonth() == currentMonth.getMonth();
            })
            .mapToDouble(Expense::getAmount).sum();
        
        String topCategory = expenses.stream()
            .collect(Collectors.groupingBy(Expense::getCategory, 
                    Collectors.summingDouble(Expense::getAmount)))
            .entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("None");
        
        Map<String, Object> result = new HashMap<>();
        result.put("totalIncome", totalIncome);
        result.put("totalExpenses", totalExpenses);
        result.put("netSavings", totalIncome - totalExpenses);
        result.put("currentMonthIncome", currentMonthIncome);
        result.put("currentMonthExpenses", currentMonthExpenses);
        result.put("currentMonthSavings", currentMonthIncome - currentMonthExpenses);
        result.put("topSpendingCategory", topCategory);
        return result;
    }

    private LocalDate parseDate(String dateStr) {
        if (dateStr == null || dateStr.trim().isEmpty()) {
            return LocalDate.now();
        }
        try {
            if (dateStr.length() >= 10 && dateStr.contains("-")) {
                return LocalDate.parse(dateStr.substring(0, 10));
            }
            return LocalDate.parse(dateStr);
        } catch (Exception e) {
            return LocalDate.now();
        }
    }
}