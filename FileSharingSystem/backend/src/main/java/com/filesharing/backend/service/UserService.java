package com.filesharing.backend.service;

import com.filesharing.backend.model.User;
import com.filesharing.backend.repository.UserRepository;
import com.filesharing.backend.repository.FileRepository;
import com.filesharing.backend.repository.FileShareRepository;
import com.filesharing.backend.repository.StarredFileRepository;
import com.filesharing.backend.model.File;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final FileRepository fileRepository;
    private final FileShareRepository fileShareRepository;
    private final StarredFileRepository starredFileRepository;

    public UserService(
        UserRepository userRepository, 
        PasswordEncoder passwordEncoder,
        FileRepository fileRepository,
        FileShareRepository fileShareRepository,
        StarredFileRepository starredFileRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.fileRepository = fileRepository;
        this.fileShareRepository = fileShareRepository;
        this.starredFileRepository = starredFileRepository;
    }

    public User registerUser(User user) {
        // Check if user already exists
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        // Encode password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // Save user
        return userRepository.save(user);
    }

    public User updateProfile(String email, String fullName, String profileImageUrl) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFullName(fullName);
        user.setProfileImageUrl(profileImageUrl);
        return userRepository.save(user);
    }

    public void updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public User updateProfileImage(String email, String imageUrl) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfileImageUrl(imageUrl);
        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
    
    public User updateNotificationPreferences(String email, boolean enabled) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        user.setNotificationsEnabled(enabled);
        return userRepository.save(user);
    }
    
    public boolean getNotificationPreferences(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        return user.isNotificationsEnabled();
    }
    
    /**
     * Deletes a user account and all associated data.
     * This includes:
     * - All files owned by the user
     * - All file share records where the user is the owner
     * - All starred file records for the user
     * 
     * @param email The email of the user to delete
     * @throws RuntimeException if the user is not found or if there's an error during deletion
     */
    @Transactional
    public void deleteAccount(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Long userId = user.getId();
        
        try {
            // 1. Delete all starred files by this user
            starredFileRepository.findByUserId(userId).forEach(starred -> {
                starredFileRepository.delete(starred);
            });
            
            // 2. Delete all file shares where user is the owner
            fileShareRepository.findByOwnerIdAndIsActiveTrue(userId).forEach(share -> {
                share.setActive(false);
                fileShareRepository.save(share);
            });
            
            // 3. Get all files owned by this user
            List<File> userFiles = fileRepository.findByUserId(userId);
            
            // 4. Delete the physical files and then remove database entries
            for (File file : userFiles) {
                try {
                    // Try to delete the actual file from disk
                    java.nio.file.Path filePath = Paths.get(file.getFilePath());
                    Files.deleteIfExists(filePath);
                } catch (IOException e) {
                    // Log the error but continue with deletion
                    System.err.println("Failed to delete file: " + file.getFilePath() + ", Error: " + e.getMessage());
                }
                
                // Delete any shares of this file
                fileShareRepository.findByFileIdAndIsActiveTrue(file.getId()).forEach(share -> {
                    share.setActive(false);
                    fileShareRepository.save(share);
                });
                
                // Delete the file record
                fileRepository.delete(file);
            }
            
            // 5. Finally delete the user
            userRepository.delete(user);
            
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete account: " + e.getMessage(), e);
        }
    }
} 