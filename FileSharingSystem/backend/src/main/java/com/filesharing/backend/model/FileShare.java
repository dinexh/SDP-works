package com.filesharing.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "file_shares")
public class FileShare {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "file_id", nullable = false)
    private Long fileId;
    
    @Column(name = "owner_id", nullable = false)
    private Long ownerId;
    
    @Column(name = "shared_with_email", nullable = false)
    private String sharedWithEmail;
    
    @Column(name = "shared_with_id")
    private Long sharedWithId;
    
    @Column(name = "permission_level", nullable = false)
    private String permissionLevel = "READ"; // Default to READ permission
    
    @Column(name = "can_edit", nullable = false)
    private boolean canEdit = false; // Default to false (read-only)
    
    @Column(name = "share_date", nullable = false)
    private LocalDateTime shareDate;
    
    @Column(name = "shared_date", nullable = false)
    private LocalDateTime sharedDate;
    
    @Column(name = "expire_date")
    private LocalDateTime expireDate;
    
    @Column(name = "access_link")
    private String accessLink;
    
    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
    
    // Default constructor
    public FileShare() {
        LocalDateTime now = LocalDateTime.now();
        this.shareDate = now;
        this.sharedDate = now;
    }
    
    // Constructor with essential fields
    public FileShare(Long fileId, Long ownerId, String sharedWithEmail) {
        this.fileId = fileId;
        this.ownerId = ownerId;
        this.sharedWithEmail = sharedWithEmail;
        LocalDateTime now = LocalDateTime.now();
        this.shareDate = now;
        this.sharedDate = now;
    }
    
    // Getters and setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getFileId() {
        return fileId;
    }
    
    public void setFileId(Long fileId) {
        this.fileId = fileId;
    }
    
    public Long getOwnerId() {
        return ownerId;
    }
    
    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }
    
    public String getSharedWithEmail() {
        return sharedWithEmail;
    }
    
    public void setSharedWithEmail(String sharedWithEmail) {
        this.sharedWithEmail = sharedWithEmail;
    }
    
    public Long getSharedWithId() {
        return sharedWithId;
    }
    
    public void setSharedWithId(Long sharedWithId) {
        this.sharedWithId = sharedWithId;
    }
    
    public String getPermissionLevel() {
        return permissionLevel;
    }
    
    public void setPermissionLevel(String permissionLevel) {
        this.permissionLevel = permissionLevel;
    }
    
    public boolean isCanEdit() {
        return canEdit;
    }
    
    public void setCanEdit(boolean canEdit) {
        this.canEdit = canEdit;
    }
    
    public LocalDateTime getShareDate() {
        return shareDate;
    }
    
    public void setShareDate(LocalDateTime shareDate) {
        this.shareDate = shareDate;
        // Keep both dates in sync
        this.sharedDate = shareDate;
    }
    
    public LocalDateTime getSharedDate() {
        return sharedDate;
    }
    
    public void setSharedDate(LocalDateTime sharedDate) {
        this.sharedDate = sharedDate;
        // Keep both dates in sync
        this.shareDate = sharedDate;
    }
    
    public LocalDateTime getExpireDate() {
        return expireDate;
    }
    
    public void setExpireDate(LocalDateTime expireDate) {
        this.expireDate = expireDate;
    }
    
    public String getAccessLink() {
        return accessLink;
    }
    
    public void setAccessLink(String accessLink) {
        this.accessLink = accessLink;
    }
    
    public boolean isActive() {
        return isActive;
    }
    
    public void setActive(boolean active) {
        isActive = active;
    }
} 