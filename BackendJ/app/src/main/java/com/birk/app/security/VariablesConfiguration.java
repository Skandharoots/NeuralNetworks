package com.birk.app.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VariablesConfiguration {

    @Value("${my.jwt_secret}")
    private String jwtSecret;

    @Value("${my.expires}")
    private Long jwtExpiration;

    @Bean
    public String getJwtSecret() {
        return jwtSecret;
    }

    @Bean
    public Long getExpiration() {
        return jwtExpiration;
    }

}
