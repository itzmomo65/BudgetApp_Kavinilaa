package com.infosys.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    @GetMapping("/")
    public String home() {
        return "<!DOCTYPE html>" +
                "<html>" +
                "<head>" +
                "<title>Budgetly Backend</title>" +
                "<style>" +
                "body { font-family: Arial, sans-serif; margin: 0; padding: 40px; background: linear-gradient(135deg, #E7DDFF 0%, #F5F2FF 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; }" +
                ".container { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1); text-align: center; max-width: 500px; }" +
                "h1 { color: #667eea; margin: 0 0 20px 0; font-size: 32px; }" +
                "p { color: #666; margin: 10px 0; font-size: 16px; }" +
                ".status { background: #d4edda; color: #155724; padding: 12px; border-radius: 8px; margin: 20px 0; }" +
                ".endpoints { text-align: left; margin: 20px 0; }" +
                ".endpoint { background: #f8f9fa; padding: 8px 12px; margin: 5px 0; border-radius: 4px; font-family: monospace; }" +
                "</style>" +
                "</head>" +
                "<body>" +
                "<div class='container'>" +
                "<h1>Budgetly Backend</h1>" +
                "<div class='status'>✅ Backend is running successfully!</div>" +
                "<p>Server is running on <strong>http://localhost:8080</strong></p>" +
                "<div class='endpoints'>" +
                "<h3>Available Endpoints:</h3>" +
                "<div class='endpoint'>POST /auth/register - User registration</div>" +
                "<div class='endpoint'>POST /auth/login - User login</div>" +
                "<div class='endpoint'>GET /user/profile - Get user profile</div>" +
                "<div class='endpoint'>PUT /user/profile - Update profile</div>" +
                "<div class='endpoint'>POST /transactions - Add transaction</div>" +
                "<div class='endpoint'>GET /transactions/incomes - Get incomes</div>" +
                "<div class='endpoint'>GET /transactions/expenses - Get expenses</div>" +
                "</div>" +
                "<p>Frontend should be running on <strong>http://localhost:3000</strong></p>" +
                "</div>" +
                "</body>" +
                "</html>";
    }

    @GetMapping("/status")
    public String status() {
        return "{\"status\": \"Backend is running\", \"port\": 8080, \"timestamp\": \"" + 
               java.time.LocalDateTime.now() + "\"}";
    }
}