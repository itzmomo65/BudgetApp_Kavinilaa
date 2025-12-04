package com.infosys.controller;

import com.infosys.dto.AuthRequest;
import com.infosys.dto.AuthResponse;
import com.infosys.service.AuthService;
import com.infosys.model.SimpleUser;
import com.infosys.repository.SimpleUserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Authentication", description = "User authentication endpoints")
public class AuthController {
    @Autowired
    private AuthService authService;
    
    @Autowired
    private SimpleUserRepository simpleUserRepository;

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Create a new user account")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.register(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, e.getMessage()));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticate user and return JWT token")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            AuthResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new AuthResponse(null, e.getMessage()));
        }
    }

    @GetMapping("/test-db")
    @Operation(summary = "Test database connection", description = "Test if database is working")
    public ResponseEntity<String> testDatabase() {
        try {
            long userCount = authService.getUserCount();
            return ResponseEntity.ok("Database connected. Total users: " + userCount);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Database error: " + e.getMessage());
        }
    }
    
    @GetMapping("/test-save")
    @Operation(summary = "Test saving user", description = "Test if we can save a simple user")
    public ResponseEntity<String> testSave() {
        try {
            SimpleUser user = new SimpleUser();
            user.setUserName("Test User");
            user.setUserEmail("test@example.com");
            user.setUserPassword("test123");
            
            System.out.println("Before save: " + user.getUserName() + ", " + user.getUserEmail());
            SimpleUser saved = simpleUserRepository.save(user);
            System.out.println("After save: ID=" + saved.getId() + ", Name=" + saved.getUserName() + ", Email=" + saved.getUserEmail());
            
            long count = simpleUserRepository.count();
            return ResponseEntity.ok("User saved with ID: " + saved.getId() + ". Total simple users: " + count);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Save error: " + e.getMessage());
        }
    }
}