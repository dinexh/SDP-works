package com.filesharing.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import com.filesharing.backend.repository.UserRepository;
import java.util.Optional;
import com.filesharing.backend.model.User;

@Service
public class EmailService {

    private final JavaMailSender emailSender;
    private final UserRepository userRepository;
    
    @Value("${spring.mail.properties.mail.smtp.from:nodemailer.10010@gmail.com}")
    private String fromEmail;

    @Autowired
    public EmailService(JavaMailSender emailSender, UserRepository userRepository) {
        this.emailSender = emailSender;
        this.userRepository = userRepository;
    }

    /**
     * Send a simple text email
     */
    public void sendSimpleMessage(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        emailSender.send(message);
    }

    /**
     * Send an HTML email with file sharing information
     * Checks if the user has notifications enabled before sending
     */
    public void sendFileSharedEmail(String to, String ownerName, String fileName) {
        // Check if the user has notifications enabled
        boolean shouldSend = true;
        Optional<User> optUser = userRepository.findByEmail(to);
        if (optUser.isPresent()) {
            User user = optUser.get();
            shouldSend = user.isNotificationsEnabled();
        }

        // If notifications are disabled, skip sending
        if (!shouldSend) {
            System.out.println("Skipping file share notification email to " + to + " due to user preferences");
            return;
        }

        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("A file has been shared with you");
            
            String htmlContent = "<html><body>" +
                    "<h2>A file has been shared with you</h2>" +
                    "<p>" + ownerName + " has shared the file \"" + fileName + "\" with you.</p>" +
                    "<p>You can access this file by logging into your account.</p>" +
                    "<p>Thank you for using our File Sharing System!</p>" +
                    "</body></html>";
            
            helper.setText(htmlContent, true);
            emailSender.send(message);
        } catch (MessagingException e) {
            // Log the error
            System.err.println("Error sending file shared email: " + e.getMessage());
        }
    }

    /**
     * Send a welcome email after sign up
     * Respects notification preferences
     */
    public void sendWelcomeEmail(String to, String fullName) {
        // Check if the user has notifications enabled (for existing users)
        boolean shouldSend = true;
        Optional<User> optUser = userRepository.findByEmail(to);
        if (optUser.isPresent()) {
            User user = optUser.get();
            shouldSend = user.isNotificationsEnabled();
        }

        // If notifications are disabled, skip sending
        if (!shouldSend) {
            System.out.println("Skipping welcome email to " + to + " due to user preferences");
            return;
        }
        
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Welcome to File Sharing System");
            
            String htmlContent = "<html><body>" +
                    "<h2>Welcome to File Sharing System!</h2>" +
                    "<p>Dear " + fullName + ",</p>" +
                    "<p>Thank you for registering with our File Sharing System. We're excited to have you on board!</p>" +
                    "<p>With our platform, you can:</p>" +
                    "<ul>" +
                    "<li>Upload and manage your files securely</li>" +
                    "<li>Share files with others easily</li>" +
                    "<li>Access your files from anywhere</li>" +
                    "</ul>" +
                    "<p>If you have any questions, feel free to contact our support team.</p>" +
                    "<p>Best regards,<br/>The File Sharing Team</p>" +
                    "</body></html>";
            
            helper.setText(htmlContent, true);
            emailSender.send(message);
        } catch (MessagingException e) {
            // Log the error
            System.err.println("Error sending welcome email: " + e.getMessage());
        }
    }

    /**
     * Send a password reset email
     * Always sends regardless of notification preferences
     */
    public void sendPasswordResetEmail(String to, String resetToken) {
        try {
            MimeMessage message = emailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject("Password Reset Request");
            
            String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;
            
            String htmlContent = "<html><body>" +
                    "<h2>Password Reset Request</h2>" +
                    "<p>You have requested to reset your password.</p>" +
                    "<p>Click the link below to reset your password:</p>" +
                    "<p><a href=\"" + resetLink + "\" style=\"background-color: #3b82f6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;\">Reset Password</a></p>" +
                    "<p>If you did not request this, please ignore this email.</p>" +
                    "<p>This link will expire in 30 minutes.</p>" +
                    "</body></html>";
            
            helper.setText(htmlContent, true);
            emailSender.send(message);
        } catch (MessagingException e) {
            // Log the error
            System.err.println("Error sending password reset email: " + e.getMessage());
        }
    }
} 