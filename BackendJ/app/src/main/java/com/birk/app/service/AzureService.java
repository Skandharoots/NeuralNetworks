package com.birk.app.service;

import com.azure.core.http.rest.PagedIterable;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.models.BlobItem;
import com.azure.storage.blob.models.BlobStorageException;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
@AllArgsConstructor
@Slf4j
public class AzureService implements IAzureService {

    private final BlobContainerClient blobContainerClient;

    private final BlobServiceClient blobServiceClient;

    @Override
    public String write(String path, String fileName, MultipartFile file)
            throws ResponseStatusException {

        try {
            BlobClient blobClient = blobContainerClient.getBlobClient(path + "/" + fileName);
            blobClient.upload(file.getInputStream(), true);
            log.info("File uploaded successfully - " + path + "/" + fileName);
            return path + "/" + fileName;
        } catch (BlobStorageException e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatusCode.valueOf(e.getStatusCode()),
                    e.getServiceMessage());
        } catch (Exception e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, e.getMessage());
        }

    }

    @Override
    public byte[] read(String path) throws ResponseStatusException {
        try {
            BlobClient client = blobContainerClient.getBlobClient(path);
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            client.downloadStream(outputStream);
            final byte[] bytes = outputStream.toByteArray();
            return bytes;
        } catch (BlobStorageException e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatusCode.valueOf(e.getStatusCode()),
                    e.getServiceMessage());
        } catch (Exception e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, e.getMessage());
        }
    }

    @Override
    public List<String> listFiles(String path) throws ResponseStatusException {
        try {
            PagedIterable<BlobItem> blobList = blobContainerClient.listBlobsByHierarchy(path + "/");
            List<String> blobNamesList = new ArrayList<>();
            for (BlobItem blob : blobList) {
                blobNamesList.add(blob.getName());
            }
            return blobNamesList;
        } catch (BlobStorageException e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatusCode.valueOf(e.getStatusCode()),
                    e.getServiceMessage());
        } catch (Exception e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, e.getMessage());
        }
    }

    @Override
    public String delete(String path) throws ResponseStatusException {

        try {
            BlobClient client = blobContainerClient.getBlobClient(path);
            client.delete();
            log.info("File deleted successfully - " + path);
            return "File deleted";

        } catch (BlobStorageException e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatusCode.valueOf(e.getStatusCode()),
                    e.getServiceMessage());
        } catch (Exception e) {
            log.error("Blob storage exception - " + e.getMessage());
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, e.getMessage());
        }
    }

    @Override
    public void createContainer(String name) throws Exception {
        try {
            blobServiceClient.createBlobContainer(name);
            log.info("Container Created");
        } catch (BlobStorageException e) {
            throw new Exception(e.getServiceMessage());
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

    @Override
    public void deleteContainer(String name) throws Exception {
        try {
            blobServiceClient.deleteBlobContainer(name);
            log.info("Container Deleted");
        } catch (BlobStorageException e) {
            throw new Exception(e.getServiceMessage());
        } catch (Exception e) {
            throw new Exception(e.getMessage());
        }
    }

}