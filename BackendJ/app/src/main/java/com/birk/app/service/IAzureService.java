package com.birk.app.service;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

public interface IAzureService {

    String write(String path, String fileName, MultipartFile file)
            throws ResponseStatusException;

    byte[] read(String path) throws ResponseStatusException;

    List<String> listFiles(String path) throws ResponseStatusException;

    String delete(String path) throws ResponseStatusException;

    void createContainer(String name) throws Exception;

    void deleteContainer(String name) throws Exception;
}
