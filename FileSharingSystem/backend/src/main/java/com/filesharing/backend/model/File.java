package com.filesharing.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "files")
public class File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "file_name", nullable = false)
    private String fileName;

    @Column(name = "file_path", nullable = false)
    private String filePath;

    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "file_type", nullable = false)
    private String fileType;

    @Column(name = "original_file_name", nullable = false)
    private String originalFileName;

    @Column(name = "upload_date", nullable = false)
    private LocalDateTime uploadDate;
    
    @Column(name = "access_code", unique = true)
    private String accessCode;
    
    @Column(name = "is_public", nullable = false, columnDefinition = "BIT(1) default 0")
    private boolean isPublic = false;
    
    @Column(name = "original_name", nullable = false)
    private String originalName;
    
    // Use ManyToOne with an optional relationship for both user fields
    // This allows the user to be null if deleted
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", insertable = false, updatable = false)
    private User owner;
    
    @Column(name = "owner_id")
    private Long ownerId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;
    
    @Column(name = "user_id")
    private Long userId;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public String getFilePath() { return filePath; }
    public void setFilePath(String filePath) { this.filePath = filePath; }
    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public String getFileType() { return fileType; }
    public void setFileType(String fileType) { this.fileType = fileType; }
    public String getOriginalFileName() { return originalFileName; }
    public void setOriginalFileName(String originalFileName) { 
        this.originalFileName = originalFileName;
        this.originalName = originalFileName; // Set both for compatibility
    }
    public LocalDateTime getUploadDate() { return uploadDate; }
    public void setUploadDate(LocalDateTime uploadDate) { this.uploadDate = uploadDate; }
    public String getAccessCode() { return accessCode; }
    public void setAccessCode(String accessCode) { this.accessCode = accessCode; }
    public boolean isPublic() { return isPublic; }
    public void setPublic(boolean isPublic) { this.isPublic = isPublic; }
    public String getOriginalName() { return originalName; }
    public void setOriginalName(String originalName) { this.originalName = originalName; }
    public Long getOwnerId() { return ownerId; }
    public void setOwnerId(Long ownerId) { this.ownerId = ownerId; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public User getOwner() { return owner; }
    public void setOwner(User owner) { 
        this.owner = owner;
        this.ownerId = owner != null ? owner.getId() : null;
    }
    
    public User getUser() { return user; }
    public void setUser(User user) { 
        this.user = user;
        this.userId = user != null ? user.getId() : null;
    }
} 