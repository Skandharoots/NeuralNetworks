package com.birk.app.service;

import com.birk.app.dto.LoginRequest;
import com.birk.app.dto.LoginResponse;
import com.birk.app.dto.RegisterRequest;
import com.birk.app.dto.UserInformationResponse;
import com.birk.app.model.UserRole;
import com.birk.app.model.Users;
import com.birk.app.repository.UserRepository;
import jakarta.transaction.Transactional;
import java.util.Optional;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
@Slf4j
public class UserService implements UserDetailsService {

        private final UserRepository userRepository;

        private static final String USER_NOT_FOUND_MESSAGE = "User with email %s not found";

        private final JwtService jwtService;

        private final BCryptPasswordEncoder bCryptPasswordEncoder;

        @Override
        public UserDetails loadUserByUsername(String email)
                        throws UsernameNotFoundException {

                return userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException(
                                                String.format(USER_NOT_FOUND_MESSAGE, email)));
        }

        public String signUpUser(RegisterRequest request) {
                Users users = new Users(
                                request.getFirstName(),
                                request.getLastName(),
                                request.getUsername(),
                                request.getEmail(),
                                request.getPassword(),
                                UserRole.USER);
                boolean userExists = userRepository
                                .findByEmail(users.getEmail())
                                .isPresent();

                if (userExists) {
                        log.error("User with email \""
                                        + users.getEmail()
                                        + "\" already exists.");
                        throw new ResponseStatusException(
                                        HttpStatus.BAD_REQUEST, "Email already taken");
                } else {
                        String encodedPassword = bCryptPasswordEncoder.encode(users.getPassword());

                        users.setPassword(encodedPassword);

                        userRepository.save(users);

                        log.info("User with email \""
                                        + users.getEmail()
                                        + "\" has been registered successfully.");

                        return "User created";
                }
        }

        public UserInformationResponse getUserInfo(UUID uuid) {

                Users user = userRepository.findByUuid(uuid).orElseThrow(
                                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

                return UserInformationResponse.builder()
                                .firstName(user.getFirstName())
                                .lastName(user.getLastName())
                                .username(user.getUserName())
                                .email(user.getUsername())
                                .build();
        }

        public void enableUser(String email) {
                userRepository.enableUser(email);
        }

        @Transactional
        public LoginResponse updateUser(UUID uuid, RegisterRequest request) {

                Optional<Users> user = userRepository.findByUuid(uuid);

                if (user.isEmpty()) {
                        log.error("User with id \"" + uuid + "\" not found.");
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "Cannot update user, user not found");
                }

                if (!bCryptPasswordEncoder.matches(request.getPassword(), user.get().getPassword())) {
                        log.error("Password does not match for user UUID {}. Account update failed.", uuid);
                        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,
                                        "Unauthorized user update request. Password does not match.");
                }

                userRepository.updateUser(uuid, request.getFirstName(),
                                request.getLastName(), request.getUsername(), request.getEmail());

                var updatedUser = userRepository.findByUuid(uuid);
                var userDetails = loadUserByUsername(request.getEmail());

                log.info("User with username \""
                                + updatedUser.get().getUsername()
                                + "\" has been updated.");

                return LoginResponse.builder()
                                .firstName(updatedUser.get().getFirstName())
                                .lastName(updatedUser.get().getLastName())
                                .username(updatedUser.get().getUserName())
                                .uuid(uuid)
                                .token(jwtService.generateToken(userDetails))
                                .build();
        }

        @Transactional
        public String deleteUser(UUID uuid) {
                Optional<Users> user = userRepository.findByUuid(uuid);
                if (user.isEmpty()) {
                        log.error("User with id \"" + uuid
                                        + "\" not found. Deletion failed.");
                        throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                                        "Cannot delete user, user not found");
                } else {
                        userRepository.deleteByUuid(uuid);
                        log.info("User with id \"" + uuid
                                        + "\" has been deleted.");

                        return "User successfully deleted";
                }
        }

}