package com.filesharing.backend.controller;

import com.filesharing.backend.model.User;
import com.filesharing.backend.service.EmailService;
import com.filesharing.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/password")
@CrossOrigin(origins = "http://localhost:3000")
public class PasswordResetController {

    private final UserService userService;
    private final EmailService emailService;
    private final Map<String, String> resetTokens = new HashMap<>(); // token -> email

    @Autowired
    public PasswordResetController(UserService userService, EmailService emailService) {
        this.userService = userService;
        this.emailService = emailService;
    }

    /**
     * Request a password reset
     * @param requestMap contains the email address
     * @return success message
     */
    @PostMapping("/request-reset")
    public ResponseEntity<?> requestPasswordReset(@RequestBody Map<String, String> requestMap) {
        String email = requestMap.get("email");
        
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email is required");
        }
        
        try {
            // Check if user exists
            User user = userService.getUserByEmail(email);
            if (user == null) {
                // Don't reveal if email exists or not for security reasons
                return ResponseEntity.ok(Map.of("message", "If your email exists in our system, you will receive a password reset link"));
            }
            
            // Generate a reset token
            String token = UUID.randomUUID().toString();
            resetTokens.put(token, email);
            
            // Send password reset email
            emailService.sendPasswordResetEmail(email, token);
            
            return ResponseEntity.ok(Map.of("message", "Password reset link sent to your email"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error processing request: " + e.getMessage());
        }
    }
    
    /**
     * Reset password with token
     * @param resetMap contains the token and new password
     * @return success message
     */
    @PostMapping("/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> resetMap) {
        String token = resetMap.get("token");
        String newPassword = resetMap.get("newPassword");
        
        if (token == null || token.isEmpty() || newPassword == null || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body("Token and new password are required");
        }
        
        // Validate token
        if (!resetTokens.containsKey(token)) {
            return ResponseEntity.badRequest().body("Invalid or expired token");
        }
        
        String email = resetTokens.get(token);
        
        try {
            // Update password
            userService.updatePassword(email, newPassword);
            
            // Remove used token
            resetTokens.remove(token);
            
            return ResponseEntity.ok(Map.of("message", "Password has been reset successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error resetting password: " + e.getMessage());
        }
    }
} 