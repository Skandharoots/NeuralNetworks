package com.birk.app.security;

import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.stereotype.Component;

@Component
public class ApplicationStartup
        implements ApplicationListener<ApplicationReadyEvent> {

    @Value("${spring.cloud.azure.storage.connection.string}")
    private String connectionString;

    /**
     * This event is executed as late as conceivably possible to indicate that
     * the application is ready to service requests. When triggered a container
     * for products is created if it does not exist
     */
    @Override
    public void onApplicationEvent(final ApplicationReadyEvent event) {
        BlobServiceClient client = new BlobServiceClientBuilder()
                .connectionString(connectionString).buildClient();
        var container = client.getBlobContainerClient("birk");
        if (!container.exists()) {
            container.create();
        }

    }
}