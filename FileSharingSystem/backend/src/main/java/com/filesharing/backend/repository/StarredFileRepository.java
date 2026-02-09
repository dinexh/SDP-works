package com.filesharing.backend.repository;

import com.filesharing.backend.model.StarredFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface StarredFileRepository extends JpaRepository<StarredFile, Long> {
    // Find all starred files for a specific user
    List<StarredFile> findByUserId(Long userId);
    
    // Find if a specific file is starred by a user
    Optional<StarredFile> findByUserIdAndFileId(Long userId, Long fileId);
    
    // Delete a starred file entry
    void deleteByUserIdAndFileId(Long userId, Long fileId);
    
    // Check if a file is starred by a user
    boolean existsByUserIdAndFileId(Long userId, Long fileId);
} 