
//used for otp sending
package com.ramya.ecommerceapplication.common.email;



import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from}")
    private String fromEmail;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String to, String otp) {
        System.out.println("⚡ Sending OTP " + otp + " to " + to);

        String subject = "Your E-commerce App Email Verification OTP";
        String text = "Hi,\n\nYour OTP for email verification is: " + otp +
                "\n\nIt is valid for 10 minutes.\n\nThank you.";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);

        try {
            mailSender.send(message);
            System.out.println("✅ OTP email sent successfully to " + to);
        } catch (Exception e) {
            System.out.println("❌ Failed to send OTP email: " + e.getMessage());
            e.printStackTrace();
        }
    }
    public void sendPasswordResetLink(String toEmail, String resetLink) {
        String subject = "Reset your password";
        String body = "Click the link below to reset your password:\n\n" +
                resetLink + "\n\n" +
                "If you did not request this, you can ignore this email.";

        sendPlainTextEmail(toEmail, subject, body); // or however you send emails
    }
    public void sendPlainTextEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }
}
