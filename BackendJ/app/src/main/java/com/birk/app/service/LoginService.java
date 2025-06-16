package com.birk.app.service;

import com.birk.app.dto.LoginRequest;
import com.birk.app.dto.LoginResponse;
import com.birk.app.model.Users;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
@Slf4j
public class LoginService {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public LoginResponse loginUser(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()));
        var user = (Users) userService.loadUserByUsername(request.getEmail());
        var userDetails = userService.loadUserByUsername(request.getEmail());
        log.info("Login successfull for user: " + user.getUsername());
        return LoginResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .uuid(user.getUuid())
                .username(user.getUserName())
                .token(jwtService.generateToken(userDetails))
                .build();

    }
}
