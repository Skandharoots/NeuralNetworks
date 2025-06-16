package com.birk.app.dto;

import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;

@Data
@Getter
@Builder
@AllArgsConstructor
public class LoginResponse {

    private final UUID uuid;
    private final String firstName;
    private final String lastName;
    private final String username;
    private final String token;

}
