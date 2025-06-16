package com.birk.app.security.config;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AzureBlobStorageConfig {

    @Value("${spring.cloud.azure.storage.blob.container-name}")
    private String containerName;

    @Value("${spring.cloud.azure.storage.connection.string}")
    private String connectionString;

    @Bean
    public BlobServiceClient getBlobServiceClient() {
        return new BlobServiceClientBuilder()
                .connectionString(connectionString).buildClient();

    }

    @Bean
    public BlobContainerClient getBlobContainerClient() {
        return getBlobServiceClient()
                .getBlobContainerClient(containerName);
    }

    @Bean
    public String getContainerName() {
        return containerName;
    }

    @Bean
    public String getConnectionString() {
        return connectionString;
    }

}