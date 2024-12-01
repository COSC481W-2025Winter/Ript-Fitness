package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobContainerClientBuilder;
import com.riptFitness.Ript_Fitness_Backend.domain.model.UserProfile;
import com.azure.storage.blob.BlobClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.io.ByteArrayInputStream;
import java.io.InputStream;

@Service
public class AzureBlobService {

    @Value("${azure.storage.connection-string}")
    private String connectionString;

    @Value("${azure.storage.container-name}")
    private String containerName;

    private BlobContainerClient getContainerClient() {
        return new BlobContainerClientBuilder()
                .connectionString(connectionString)
                .containerName(containerName)
                .buildClient();
    }

    public String uploadPhoto(String username, byte[] photoBytes, String photoName) {
        BlobClient blobClient = getContainerClient().getBlobClient(username + "/" + photoName);
        try (InputStream photoStream = new ByteArrayInputStream(photoBytes)) {
            blobClient.upload(photoStream, photoBytes.length, true);
        } catch (Exception e) {
            throw new RuntimeException("Error uploading photo to Azure Blob Storage", e);
        }
        return blobClient.getBlobUrl();
    }

    public List<String> listPhotos(String username, int startIndex, int endIndex) {
        List<String> photoUrls = new ArrayList<>();
        int currentIndex = 0;

        for (var blobItem : getContainerClient().listBlobs()) {
            String blobName = blobItem.getName();
            if (blobName.startsWith(username + "/")) {
                if (currentIndex >= startIndex && currentIndex < endIndex) {
                    photoUrls.add(getContainerClient().getBlobClient(blobName).getBlobUrl());
                }
                currentIndex++;
                if (currentIndex >= endIndex) break;
            }
        }
        return photoUrls;
    }

    public void deletePhoto(String username, String photoName) {
        BlobClient blobClient = getContainerClient().getBlobClient(username + "/" + photoName);
        blobClient.delete();
    }
}
