package com.filesharing.backend.repository;

import com.filesharing.backend.model.FileShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FileShareRepository extends JpaRepository<FileShare, Long> {
    // Find shares by recipient's email
    List<FileShare> findBySharedWithEmailAndIsActiveTrue(String email);
    
    // Find shares by recipient's ID
    List<FileShare> findBySharedWithIdAndIsActiveTrue(Long userId);
    
    // Find shares by owner ID
    List<FileShare> findByOwnerIdAndIsActiveTrue(Long userId);
    
    // Find shares for a specific file
    List<FileShare> findByFileIdAndIsActiveTrue(Long fileId);
    
    // Check if a file is already shared with an email
    boolean existsByFileIdAndSharedWithEmailAndIsActiveTrue(Long fileId, String email);
    
    // Check if a file is already shared with a user
    boolean existsByFileIdAndSharedWithIdAndIsActiveTrue(Long fileId, Long userId);
    
    // Find a specific share by file ID and email
    FileShare findByFileIdAndSharedWithEmailAndIsActiveTrue(Long fileId, String email);
    
    // Find a specific share by file ID and user ID
    FileShare findByFileIdAndSharedWithIdAndIsActiveTrue(Long fileId, Long userId);
} 