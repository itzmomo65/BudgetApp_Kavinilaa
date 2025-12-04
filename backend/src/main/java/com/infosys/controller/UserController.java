package com.infosys.controller;

import com.infosys.model.User;
import com.infosys.model.Profile;
import com.infosys.repository.UserRepository;
import com.infosys.repository.ProfileRepository;
import com.infosys.config.JwtUtil;
import com.infosys.dto.ProfileRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "User Profile", description = "User profile management endpoints")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProfileRepository profileRepository;
    
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/profile")
    @Operation(summary = "Get user profile", description = "Retrieve user profile information")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> getProfile(@RequestHeader("Authorization") String token) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtil.extractEmail(jwt);
            
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Profile profile = profileRepository.findByUserId(user.getId()).orElse(null);
            
            return ResponseEntity.ok(new UserProfileResponse(user, profile));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid token");
        }
    }

    @PutMapping("/profile")
    @Operation(summary = "Update user profile", description = "Update user profile information")
    @SecurityRequirement(name = "Bearer Authentication")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String token,
            @RequestBody ProfileRequest request) {
        try {
            String jwt = token.substring(7);
            String email = jwtUtil.extractEmail(jwt);
            
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            Profile profile = profileRepository.findByUserId(user.getId())
                    .orElse(new Profile());
            
            if (profile.getUserId() == null) {
                profile.setUserId(user.getId());
            }
            
            profile.setPhone(request.getPhone());
            profile.setAddress(request.getAddress());
            profile.setGender(request.getGender());
            profile.setDateOfBirth(request.getDateOfBirth());
            profile.setOccupation(request.getOccupation());
            profile.setUpdatedAt(LocalDateTime.now());
            
            profileRepository.save(profile);
            
            return ResponseEntity.ok(new MessageResponse("Profile updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    static class UserProfileResponse {
        private String name;
        private String email;
        private String phone;
        private String address;
        private String gender;
        private String dateOfBirth;
        private String occupation;
        
        public UserProfileResponse(User user, Profile profile) {
            this.name = user.getName();
            this.email = user.getEmail();
            if (profile != null) {
                this.phone = profile.getPhone();
                this.address = profile.getAddress();
                this.gender = profile.getGender();
                this.dateOfBirth = profile.getDateOfBirth();
                this.occupation = profile.getOccupation();
            }
        }
        
        public String getName() { return name; }
        public String getEmail() { return email; }
        public String getPhone() { return phone; }
        public String getAddress() { return address; }
        public String getGender() { return gender; }
        public String getDateOfBirth() { return dateOfBirth; }
        public String getOccupation() { return occupation; }
    }
    
    static class MessageResponse {
        private String message;
        
        public MessageResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() { return message; }
    }
}