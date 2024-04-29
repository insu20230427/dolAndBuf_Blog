package com.insu.blog.service;

import com.insu.blog.dto.request.EmailRequestDto;
import com.insu.blog.entity.User;
import com.insu.blog.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {
    private final JavaMailSender javaMailSender;
    public final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;

    public String  sendTempPasswordMail(String email) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        String tempPassword = createCode() + "_temp-password";

        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            mimeMessageHelper.setTo(email); // 메일 수신자
            mimeMessageHelper.setSubject("임시 비밀번호 발급"); // 메일 제목
            mimeMessageHelper.setText("임시 비밀번호는 " + tempPassword + "입니다.");
            javaMailSender.send(mimeMessage);

            log.info("sendTempPasswordMail() Success");

            User user = userRepository.findByEmail(email);
            user.setPassword(passwordEncoder.encode(tempPassword));
            userRepository.save(user);

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), tempPassword)
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            return tempPassword;

        } catch (MessagingException e) {
            log.info("sendTempPasswordMail() fail");
            throw new RuntimeException(e);
        }
    }

    public String sendUsernameMail(String email) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        String authNum = createCode();

        String username = userRepository.findByEmail(email).getUsername();

        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            mimeMessageHelper.setTo(email); // 메일 수신자
            mimeMessageHelper.setSubject("아이디 찾기"); // 메일 제목
            mimeMessageHelper.setText("가입하신 아이디는 " + username + " 입니다.");
            javaMailSender.send(mimeMessage);

            log.info("sendUsernameMail() Success");

            return authNum;

        } catch (MessagingException e) {
            log.info("sendUsernameMail() fail");
            throw new RuntimeException(e);
        }
    }


    public String sendCodeMail(String email) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        String authNum = createCode();

        try {
            MimeMessageHelper mimeMessageHelper = new MimeMessageHelper(mimeMessage, false, "UTF-8");
            mimeMessageHelper.setTo(email); // 메일 수신자
            mimeMessageHelper.setSubject("인증을 위한 코드 발송"); // 메일 제목
            mimeMessageHelper.setText("인증코드는 " + authNum + "입니다.");
            javaMailSender.send(mimeMessage);

            log.info("sendCodeMail() Success");

            return authNum;

        } catch (MessagingException e) {
            log.info("sendCodeMail() fail");
            throw new RuntimeException(e);
        }
    }


    // 인증번호 및 임시 비밀번호 생성 메서드
    public String createCode() {
        Random random = new Random();
        StringBuffer key = new StringBuffer();

        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(4);

            switch (index) {
                // case0,1 : 소문자, 대문자 랜덤생성, deafault: 0~9까지 임의의 숫자 랜덤생성
                case 0:
                    key.append((char) (random.nextInt(26) + 97));
                    break;
                case 1:
                    key.append((char) (random.nextInt(26) + 65));
                    break;
                default:
                    key.append(random.nextInt(9));
            }
        }
        return key.toString();
    }
}
