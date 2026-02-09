package com.filesharing.backend.controller;

import com.filesharing.backend.model.File;
import com.filesharing.backend.service.FileService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.io.FileInputStream;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.util.StreamUtils;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import com.filesharing.backend.model.FileShare;
import java.util.Collections;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {"http://localhost:3000", "http://docs.google.com", "https://docs.google.com"}, 
             allowedHeaders = "*", 
             exposedHeaders = {HttpHeaders.CONTENT_DISPOSITION, HttpHeaders.CONTENT_TYPE})
public class FileController {
    private final FileService fileService;
    @Value("${file.upload-dir}")
    private String uploadDir;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<File> uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        System.out.println("Upload endpoint hit!");
        
        // Get current authenticated user ID
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = 1L; // Default
        
        if (principal instanceof UserDetails) {
            String username = ((UserDetails)principal).getUsername();
            // Get user ID by username/email
            userId = fileService.getUserIdByEmail(username);
        }
        
        File uploadedFile = fileService.uploadFile(file, userId);
        return ResponseEntity.ok(uploadedFile);
    }

    @GetMapping
    public ResponseEntity<List<File>> getAllFiles() {
        // Get current authenticated user ID
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = 1L; // Default
        
        if (principal instanceof UserDetails) {
            String username = ((UserDetails)principal).getUsername();
            // Get user ID by username/email
            userId = fileService.getUserIdByEmail(username);
        }
        
        List<File> files = fileService.getFilesByUserId(userId);
        return ResponseEntity.ok(files);
    }
    
    @GetMapping("/with-details")
    public ResponseEntity<List<Map<String, Object>>> getAllFilesWithDetails() {
        // Get current authenticated user ID
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = 1L; // Default
        
        if (principal instanceof UserDetails) {
            String username = ((UserDetails)principal).getUsername();
            // Get user ID by username/email
            userId = fileService.getUserIdByEmail(username);
        }
        
        // Use the method that adds star status to files
        List<Map<String, Object>> filesWithDetails = fileService.getFilesWithUserDetailsByUserIdWithStars(userId);
        return ResponseEntity.ok(filesWithDetails);
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<File>> getFilesByUserId(@PathVariable Long userId) {
        List<File> files = fileService.getFilesByUserId(userId);
        return ResponseEntity.ok(files);
    }
    
    @GetMapping("/download/{fileId}")
    public void downloadFile(@PathVariable Long fileId, HttpServletResponse response) throws IOException {
        try {
            // Get current authenticated user ID
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Long userId = 1L; // Default
            String email = "";
            
            if (principal instanceof UserDetails) {
                String username = ((UserDetails)principal).getUsername();
                userId = fileService.getUserIdByEmail(username);
                email = username;
            }
            
            File file = fileService.getFileById(fileId);
            
            // Check if user has access to the file
            boolean hasAccess = file.getUserId().equals(userId) || file.isPublic() ||
                                fileService.hasAccessToFile(fileId, userId);
            
            if (!hasAccess) {
                response.sendError(HttpStatus.FORBIDDEN.value(), "You don't have permission to access this file");
                return;
            }
            
            Path filePath = Paths.get(file.getFilePath());
            java.io.File fileObject = filePath.toFile();
            
            if (!fileObject.exists()) {
                response.sendError(HttpStatus.NOT_FOUND.value(), "File not found");
                return;
            }
            
            // Set CORS headers manually
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "*");
            response.setHeader("Access-Control-Expose-Headers", "Content-Disposition, Content-Type, Content-Length");
            response.setHeader("Cache-Control", "max-age=86400");
            
            // Set content type
            response.setContentType(file.getFileType());
            response.setContentLengthLong(fileObject.length());
            
            // Determine if we should display inline (for images and PDFs) or as attachment (for other files)
            boolean isInlineViewable = file.getFileType() != null && 
                (file.getFileType().equals("application/pdf") || 
                 file.getFileType().startsWith("image/"));
            
            if (isInlineViewable) {
                response.setHeader("Content-Disposition", "inline; filename=\"" + file.getOriginalFileName() + "\"");
            } else {
                response.setHeader("Content-Disposition", "attachment; filename=\"" + file.getOriginalFileName() + "\"");
            }
            
            // Copy the file content directly to the response output stream
            try (InputStream inputStream = new FileInputStream(fileObject)) {
                StreamUtils.copy(inputStream, response.getOutputStream());
                response.getOutputStream().flush();
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error downloading file: " + e.getMessage());
        }
    }
    
    @GetMapping("/view/{fileId}")
    public void viewFile(@PathVariable Long fileId, HttpServletResponse response) throws IOException {
        try {
            // Get current authenticated user ID
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Long userId = 1L; // Default
            
            if (principal instanceof UserDetails) {
                String username = ((UserDetails)principal).getUsername();
                // Get user ID by username/email
                userId = fileService.getUserIdByEmail(username);
            }
            
            File file = fileService.getFileById(fileId);
            
            // Check if user has access to the file
            if (!file.getUserId().equals(userId) && !file.isPublic()) {
                response.sendError(HttpStatus.FORBIDDEN.value(), "You don't have permission to access this file");
                return;
            }
            
            // Check if the file is viewable (PDF or image)
            boolean isViewable = file.getFileType() != null && 
                (file.getFileType().equals("application/pdf") || 
                 file.getFileType().startsWith("image/"));
                
            if (!isViewable) {
                response.sendError(HttpStatus.BAD_REQUEST.value(), "Only PDF and image files can be viewed");
                return;
            }
            
            Path filePath = Paths.get(file.getFilePath());
            java.io.File fileObject = filePath.toFile();
            
            if (!fileObject.exists()) {
                response.sendError(HttpStatus.NOT_FOUND.value(), "File not found");
                return;
            }
            
            // Set headers for in-browser viewing (iframe-friendly)
            response.setHeader("Content-Type", file.getFileType());
            response.setHeader("Content-Disposition", "inline; filename=\"" + file.getOriginalFileName() + "\"");
            response.setHeader("Cache-Control", "public, max-age=86400");
            
            // CORS headers for iframe viewing
            response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
            response.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", "*");
            response.setHeader("Access-Control-Allow-Credentials", "true");
            response.setHeader("Access-Control-Expose-Headers", "Content-Disposition, Content-Type, Content-Length");
            response.setHeader("X-Frame-Options", "SAMEORIGIN");
            
            // Content length
            response.setContentLengthLong(fileObject.length());
            
            // Stream the file directly
            try (InputStream inputStream = new FileInputStream(fileObject)) {
                StreamUtils.copy(inputStream, response.getOutputStream());
                response.getOutputStream().flush();
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Error viewing file: " + e.getMessage());
        }
    }

    @GetMapping("/pdf/{fileId}")
    public ResponseEntity<Resource> viewPdf(
            @PathVariable Long fileId,
            @RequestParam(value = "token", required = false) String tokenParam) throws IOException {
        
        // First, try to get current authenticated user from security context
        Long userId = 1L; // Default
        String userEmail = "";
        
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            String username = ((UserDetails)principal).getUsername();
            userId = fileService.getUserIdByEmail(username);
            userEmail = username;
        }
        
        // Get the file
        File file = fileService.getFileById(fileId);
        
        // Check if user has access to the file - include shared files in check
        boolean hasAccess = file.getUserId().equals(userId) || 
                          file.isPublic() || 
                          fileService.hasAccessToFile(fileId, userId);
        
        if (!hasAccess) {
            throw new IOException("You don't have permission to access this file");
        }
        
        // Check if it's a PDF or image
        boolean isPdfOrImage = file.getFileType() != null && 
            (file.getFileType().equals("application/pdf") || 
             file.getFileType().startsWith("image/"));
         
        if (!isPdfOrImage) {
            return ResponseEntity.badRequest().build();
        }
        
        Path filePath = Paths.get(file.getFilePath());
        Resource resource = new UrlResource(filePath.toUri());
        
        if (!resource.exists()) {
            throw new IOException("File not found: " + file.getOriginalFileName());
        }
        
        // Create headers with CORS settings specifically for viewing
        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getOriginalFileName() + "\"");
        headers.add(HttpHeaders.CACHE_CONTROL, "max-age=3600");
        headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "*");
        headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, "GET, OPTIONS");
        headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, "*");
        headers.add(HttpHeaders.ACCESS_CONTROL_MAX_AGE, "3600");
        
        // Use the file's content type
        MediaType mediaType;
        if (file.getFileType().equals("application/pdf")) {
            mediaType = MediaType.APPLICATION_PDF;
        } else {
            // For images, use the appropriate media type
            mediaType = MediaType.parseMediaType(file.getFileType());
        }
        
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(mediaType)
                .body(resource);
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(@PathVariable Long fileId) throws IOException {
        fileService.deleteFile(fileId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/star/{fileId}")
    public ResponseEntity<Map<String, Object>> starFile(@PathVariable Long fileId) {
        // Get current authenticated user ID
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = 1L; // Default
        
        if (principal instanceof UserDetails) {
            String username = ((UserDetails)principal).getUsername();
            // Get user ID by username/email
            userId = fileService.getUserIdByEmail(username);
        }
        
        boolean starred = fileService.starFile(fileId, userId);
        Map<String, Object> response = Map.of(
            "success", true,
            "fileId", fileId,
            "starred", true,
            "status", starred ? "STARRED" : "ALREADY_STARRED"
        );
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/star/{fileId}")
    public ResponseEntity<Map<String, Object>> unstarFile(@PathVariable Long fileId) {
        // Get current authenticated user ID
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = 1L; // Default
        
        if (principal instanceof UserDetails) {
            String username = ((UserDetails)principal).getUsername();
            // Get user ID by username/email
            userId = fileService.getUserIdByEmail(username);
        }
        
        boolean unstarred = fileService.unstarFile(fileId, userId);
        Map<String, Object> response = Map.of(
            "success", true,
            "fileId", fileId,
            "starred", false,
            "status", unstarred ? "UNSTARRED" : "NOT_STARRED"
        );
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/starred")
    public ResponseEntity<List<Map<String, Object>>> getStarredFiles() {
        // Get current authenticated user ID
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = 1L; // Default
        
        if (principal instanceof UserDetails) {
            String username = ((UserDetails)principal).getUsername();
            // Get user ID by username/email
            userId = fileService.getUserIdByEmail(username);
        }
        
        List<Map<String, Object>> starredFiles = fileService.getStarredFilesWithDetailsByUserId(userId);
        return ResponseEntity.ok(starredFiles);
    }

    @PostMapping("/share")
    public ResponseEntity<?> shareFile(@RequestBody Map<String, Object> shareRequest) {
        try {
            // Get current authenticated user ID
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Long userId = 1L; // Default
            
            if (principal instanceof UserDetails) {
                String username = ((UserDetails)principal).getUsername();
                userId = fileService.getUserIdByEmail(username);
            }
            
            Long fileId = ((Number) shareRequest.get("fileId")).longValue();
            String recipientEmail = (String) shareRequest.get("email");
            
            if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Recipient email is required"));
            }
            
            // Extract canEdit parameter if provided
            Boolean canEdit = shareRequest.get("canEdit") != null ? 
                (Boolean) shareRequest.get("canEdit") : false;
            
            FileShare share = fileService.shareFileWithEmail(fileId, userId, recipientEmail, canEdit);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "File shared successfully with " + recipientEmail,
                "shareId", share.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @DeleteMapping("/share")
    public ResponseEntity<?> unshareFile(@RequestBody Map<String, Object> unshareRequest) {
        try {
            // Get current authenticated user ID
            Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Long userId = 1L; // Default
            
            if (principal instanceof UserDetails) {
                String username = ((UserDetails)principal).getUsername();
                userId = fileService.getUserIdByEmail(username);
            }
            
            Long fileId = ((Number) unshareRequest.get("fileId")).longValue();
            String recipientEmail = (String) unshareRequest.get("email");
            
            if (recipientEmail == null || recipientEmail.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Recipient email is required"));
            }
            
            boolean result = fileService.unshareFile(fileId, userId, recipientEmail);
            
            if (result) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "File access revoked from " + recipientEmail
                ));
            } else {
                return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "File was not shared with " + recipientEmail
                ));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/shared-with-me")
    public ResponseEntity<List<Map<String, Object>>> getFilesSharedWithMe() {
        // Get current authenticated user's email
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = "";
        
        if (principal instanceof UserDetails) {
            email = ((UserDetails)principal).getUsername(); // Email is used as username
        }
        
        if (email.isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        
        List<Map<String, Object>> sharedFiles = fileService.getFilesSharedWithEmail(email);
        return ResponseEntity.ok(sharedFiles);
    }
    
    @GetMapping("/shared-by-me")
    public ResponseEntity<List<Map<String, Object>>> getFilesSharedByMe() {
        // Get current authenticated user ID
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = 1L; // Default
        
        if (principal instanceof UserDetails) {
            String username = ((UserDetails)principal).getUsername();
            userId = fileService.getUserIdByEmail(username);
        }
        
        List<Map<String, Object>> sharedFiles = fileService.getFilesSharedByUser(userId);
        return ResponseEntity.ok(sharedFiles);
    }
} 