package com.filesharing.backend.controller;

import com.filesharing.backend.model.User;
import com.filesharing.backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserService userService;
    
    @Value("${file.upload-dir}")
    private String uploadDir;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(Authentication authentication) {
        User user = userService.getUserByEmail(authentication.getName());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication authentication, @RequestBody UpdateProfileRequest request) {
        User user = userService.updateProfile(authentication.getName(), request.getFullName(), request.getProfileImageUrl());
        return ResponseEntity.ok(user);
    }

    @PutMapping("/profile/password")
    public ResponseEntity<?> updatePassword(Authentication authentication, @RequestBody UpdatePasswordRequest request) {
        userService.updatePassword(authentication.getName(), request.getPassword());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile/image")
    public ResponseEntity<?> updateProfileImage(
            Authentication authentication,
            @RequestBody UpdateProfileImageRequest request) {
        User user = userService.updateProfileImage(authentication.getName(), request.getImageUrl());
        return ResponseEntity.ok(user);
    }
    
    @PostMapping("/profile/upload")
    public ResponseEntity<?> uploadProfileImage(
            Authentication authentication,
            @RequestParam("file") MultipartFile file) throws IOException {
        
        // Create profiles directory if it doesn't exist
        Path profilesDir = Paths.get(uploadDir, "profiles");
        if (!Files.exists(profilesDir)) {
            Files.createDirectories(profilesDir);
        }
        
        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            fileExtension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String newFilename = UUID.randomUUID().toString() + fileExtension;
        
        // Save the file
        Path targetLocation = profilesDir.resolve(newFilename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
        
        // Generate the relative path for database storage and access
        String profileImageUrl = "/api/users/profile/image/" + newFilename;
        
        // Update user profile with new image URL
        User user = userService.updateProfileImage(authentication.getName(), profileImageUrl);
        
        // Return the URL
        Map<String, String> response = new HashMap<>();
        response.put("profileImageUrl", profileImageUrl);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/profile/image/{filename}")
    public ResponseEntity<?> getProfileImage(@PathVariable String filename) throws IOException {
        Path imagePath = Paths.get(uploadDir, "profiles", filename);
        
        if (!Files.exists(imagePath)) {
            return ResponseEntity.notFound().build();
        }
        
        byte[] imageBytes = Files.readAllBytes(imagePath);
        
        // Determine content type based on file extension
        String contentType = "image/jpeg"; // Default
        String extension = filename.toLowerCase();
        
        if (extension.endsWith(".png")) {
            contentType = "image/png";
        } else if (extension.endsWith(".gif")) {
            contentType = "image/gif";
        } else if (extension.endsWith(".bmp")) {
            contentType = "image/bmp";
        } else if (extension.endsWith(".webp")) {
            contentType = "image/webp";
        }
        
        return ResponseEntity.ok()
                .header("Content-Type", contentType)
                .body(imageBytes);
    }

    @GetMapping("/notifications")
    public ResponseEntity<?> getNotificationPreferences(Authentication authentication) {
        boolean enabled = userService.getNotificationPreferences(authentication.getName());
        return ResponseEntity.ok(Map.of("enabled", enabled));
    }
    
    @PutMapping("/notifications")
    public ResponseEntity<?> updateNotificationPreferences(Authentication authentication, @RequestBody Map<String, Boolean> request) {
        Boolean enabled = request.get("enabled");
        if (enabled == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Enabled parameter is required"));
        }
        
        User user = userService.updateNotificationPreferences(authentication.getName(), enabled);
        return ResponseEntity.ok(Map.of(
            "message", "Notification preferences updated",
            "enabled", user.isNotificationsEnabled()
        ));
    }
    
    @DeleteMapping("/account")
    public ResponseEntity<?> deleteAccount(Authentication authentication) {
        try {
            userService.deleteAccount(authentication.getName());
            return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}

class UpdateProfileRequest {
    private String fullName;
    private String profileImageUrl;
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
}

class UpdatePasswordRequest {
    private String password;
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
}

class UpdateProfileImageRequest {
    private String imageUrl;
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
} 