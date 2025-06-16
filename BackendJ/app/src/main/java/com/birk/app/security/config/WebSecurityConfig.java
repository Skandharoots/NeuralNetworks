package com.birk.app.security.config;

import java.util.List;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.birk.app.security.JwtFilter;
import com.birk.app.service.UserService;

@Configuration
@AllArgsConstructor
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

        private final UserService userService;

        private final BCryptPasswordEncoder bCryptPasswordEncoder;

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowCredentials(true);
                configuration.setAllowedOrigins(List.of("http://localhost:8081"));
                configuration.setMaxAge(3600L);
                configuration.setAllowedHeaders(List.of("*"));
                configuration.setAllowedMethods(List.of("*"));
                configuration.setExposedHeaders(List.of("*"));
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                return source;
        }

        @Bean
        public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
                http
                                .cors(c -> c.configurationSource(corsConfigurationSource()))
                                .csrf(httpSecurityCsrfConfigurer -> httpSecurityCsrfConfigurer
                                                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
                                                .csrfTokenRequestHandler(new CsrfTokenRequestAttributeHandler()))
                                .authorizeHttpRequests((requests) -> requests
                                                .requestMatchers(HttpMethod.POST, "/api/v*/users/register").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/v*/users/login").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/v*/users/get/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/api/v*/users/csrf/token").permitAll()
                                                .requestMatchers(HttpMethod.PUT, "/api/v*/users/update/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.DELETE, "api/v*/users/delete/**")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/v*/users/picture")
                                                .permitAll()
                                                .requestMatchers(HttpMethod.GET, "/apiv*/users/picture").permitAll()
                                                .requestMatchers(HttpMethod.GET, "/apiv*/users/picture/list")
                                                .permitAll()
                                                .requestMatchers("/actuator/**").permitAll()
                                                .requestMatchers("/actuator/prometheus").permitAll()
                                                .requestMatchers("/swagger-ui.html").permitAll()
                                                .requestMatchers("/swagger-ui/**").permitAll()
                                                .requestMatchers("/api-docs/**",
                                                                "/v3/api-docs/**")
                                                .permitAll()
                                                .requestMatchers("/error").permitAll()
                                                .anyRequest()
                                                .authenticated())
                                .sessionManagement(customizer -> customizer
                                                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .formLogin(AbstractHttpConfigurer::disable)
                                .authenticationProvider(daoAuthenticationProvider())
                                .addFilterBefore(authenticationTokenFilter(),
                                                UsernamePasswordAuthenticationFilter.class);
                return http.build();
        }

        @Bean
        public DaoAuthenticationProvider daoAuthenticationProvider() {
                DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
                provider.setPasswordEncoder(bCryptPasswordEncoder);
                provider.setUserDetailsService(userService);
                return provider;
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
                        throws Exception {
                return config.getAuthenticationManager();
        }

        @Bean
        public JwtFilter authenticationTokenFilter() {
                return new JwtFilter();
        }

}