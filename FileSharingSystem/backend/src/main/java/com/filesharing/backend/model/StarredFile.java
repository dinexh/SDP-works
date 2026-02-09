package com.filesharing.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "starred_files", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "file_id"})
})
public class StarredFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "file_id", nullable = false)
    private Long fileId;
    
    @Column(name = "starred_date", nullable = false)
    private java.time.LocalDateTime starredDate;
    
    // Default constructor
    public StarredFile() {
        this.starredDate = java.time.LocalDateTime.now();
    }
    
    // Constructor with fields
    public StarredFile(Long userId, Long fileId) {
        this.userId = userId;
        this.fileId = fileId;
        this.starredDate = java.time.LocalDateTime.now();
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getUserId() {
        return userId;
    }
    
    public void setUserId(Long userId) {
        this.userId = userId;
    }
    
    public Long getFileId() {
        return fileId;
    }
    
    public void setFileId(Long fileId) {
        this.fileId = fileId;
    }
    
    public java.time.LocalDateTime getStarredDate() {
        return starredDate;
    }
    
    public void setStarredDate(java.time.LocalDateTime starredDate) {
        this.starredDate = starredDate;
    }
} 