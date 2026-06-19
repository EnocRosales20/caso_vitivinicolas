package com.vitivinicolas.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient inventoryWebClient() {
        // Apunta al puerto 8081 del microservicio de inventario que ya tienes corriendo
        return WebClient.builder()
                .baseUrl("http://localhost:8081/api/productos") 
                .build();
    }
}