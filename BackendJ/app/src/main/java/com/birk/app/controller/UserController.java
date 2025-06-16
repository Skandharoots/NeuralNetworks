package com.birk.app.controller;

import com.birk.app.dto.LoginRequest;
import com.birk.app.dto.LoginResponse;
import com.birk.app.dto.RegisterRequest;
import com.birk.app.dto.UserInformationResponse;
import com.birk.app.service.AzureService;
import com.birk.app.service.LoginService;
import com.birk.app.service.UserService;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/users")
@AllArgsConstructor
public class UserController {

    private final UserService userService;

    private final AzureService azureService;

    private final LoginService loginService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public String register(@Valid @RequestBody RegisterRequest request) {
        return userService.signUpUser(request);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(loginService.loginUser(request));
    }

    @PostMapping("/get/{uuid}")
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<UserInformationResponse> getUserInformation(
            @PathVariable(name = "uuid") UUID uuid) {
        return ResponseEntity.ok(userService.getUserInfo(uuid));
    }

    @PutMapping("/update/{uuid}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public ResponseEntity<LoginResponse> updateUser(
            @PathVariable("uuid") UUID uuid,
            @Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(userService.updateUser(uuid, request));
    }

    @DeleteMapping("/delete/{uuid}")
    @ResponseStatus(HttpStatus.OK)
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public String deleteUser(@PathVariable("uuid") UUID uuid) {

        return userService.deleteUser(uuid);
    }

    @GetMapping("/csrf/token")
    public CsrfToken getCsrfToken(CsrfToken token) {

        return token;
    }

    @PostMapping("/picture")
    public String postMethodName(
            @RequestPart(name = "path") String path,
            @RequestPart(name = "fileName") String fileName,
            @RequestPart(name = "file") MultipartFile file) throws ResponseStatusException {
        return azureService.write(path, fileName, file);
    }

    @GetMapping("/picture")
    public byte[] getPicture(
            @RequestParam(name = "path") String path) throws ResponseStatusException {
        return azureService.read(path);
    }

    @GetMapping("/picture/list")
    public List<String> getList(
            @RequestParam(name = "path") String path) throws ResponseStatusException {
        return azureService.listFiles(path);
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Map<String, String> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return errors;
    }
}