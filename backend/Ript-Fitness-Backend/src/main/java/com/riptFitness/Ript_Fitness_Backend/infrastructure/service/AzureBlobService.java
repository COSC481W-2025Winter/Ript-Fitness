package com.riptFitness.Ript_Fitness_Backend.infrastructure.service;

import com.azure.core.http.rest.PagedIterable;
import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobContainerClientBuilder;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.models.BlobHttpHeaders;
import com.azure.storage.blob.models.BlobItem;
import com.azure.storage.blob.models.BlobListDetails;
import com.azure.storage.blob.models.BlobProperties;
import com.azure.storage.blob.models.ListBlobsOptions;
import com.azure.storage.blob.sas.BlobContainerSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;
import com.azure.storage.common.sas.SasProtocol;

import io.github.cdimascio.dotenv.Dotenv;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AzureBlobService {

    @Value("${azure.storage.connection-string}")
    private String connectionString;

    @Value("${azure.storage.container-name}")
    private String containerName;

    public AzureBlobService() {
        // Use dotenv to fetch the values directly
        Dotenv dotenv = Dotenv.configure().load();
        this.connectionString = dotenv.get("BLOB_CONNECTION_STRING");
        this.containerName = dotenv.get("BLOB_CONTAINER_NAME");

        if (connectionString == null || containerName == null) {
            throw new IllegalArgumentException("Azure configuration values are missing!");
        }
    }

    private BlobContainerClient getContainerClient() {
        return new BlobContainerClientBuilder()
                .connectionString(connectionString)
                .containerName(containerName)
                .buildClient();
    }

    public String uploadPhoto(String username, byte[] photoBytes, String photoName, String contentType) {
        String blobName = username + "/" + photoName;
        BlobClient blobClient = getContainerClient().getBlobClient(blobName);

        try (InputStream photoStream = new ByteArrayInputStream(photoBytes)) {
            // Upload the photo
            blobClient.upload(photoStream, photoBytes.length, true);

            // Set Content-Type for the uploaded blob
            blobClient.setHttpHeaders(new BlobHttpHeaders().setContentType(contentType));
        } catch (Exception e) {
            throw new RuntimeException("Error uploading photo to Azure Blob Storage: " + blobName, e);
        }

        // Return the full URL of the uploaded blob
        return blobClient.getBlobUrl();
    }


    public List<String> listPhotos(String username, int startIndex, int endIndex) {
        List<String> photoUrls = new ArrayList<>();
        int currentIndex = 0;

        // Specify to include metadata but exclude deleted blobs
        BlobListDetails details = new BlobListDetails().setRetrieveDeletedBlobs(true);
        ListBlobsOptions options = new ListBlobsOptions().setDetails(details);

        for (BlobItem blobItem : getContainerClient().listBlobs(options, null)) {
            // Skip deleted blobs
            if (blobItem.isDeleted()) {
                continue;
            }

            String blobName = blobItem.getName();
            if (blobName.startsWith(username + "/")) {
                if (currentIndex >= startIndex && currentIndex < endIndex) {
                    String sasUrl = generateSasUrl(blobName);
                    photoUrls.add(sasUrl);
                }
                currentIndex++;
                if (currentIndex >= endIndex) break;
            }
        }
        return photoUrls;
    }





    String extractBlobNameFromUrl(String url, String username) throws MalformedURLException {
        URL urlObj = new URL(url);
        String path = java.net.URLDecoder.decode(urlObj.getPath(), StandardCharsets.UTF_8); // Decode the URL path
        String containerNameWithLeadingSlash = "/" + containerName + "/";
        
        if (path.startsWith(containerNameWithLeadingSlash)) {
            return path.substring(containerNameWithLeadingSlash.length());
        } else {
            throw new IllegalArgumentException("URL does not contain the expected container name");
        }
    }


    public String generateSasUrl(String blobName) {
        // Create the BlobServiceClient using the connection string
        BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                .connectionString(connectionString)
                .buildClient();

        // Get the container client
        BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);

        // Get the blob client
        BlobClient blobClient = containerClient.getBlobClient(blobName);

        // Define the SAS token permissions and expiration
        BlobContainerSasPermission permission = new BlobContainerSasPermission()
                .setReadPermission(true);

        OffsetDateTime expiryTime = OffsetDateTime.now().plusHours(1);

        BlobServiceSasSignatureValues sasValues = new BlobServiceSasSignatureValues(expiryTime, permission)
                .setProtocol(SasProtocol.HTTPS_ONLY)
                .setStartTime(OffsetDateTime.now());

        // Generate the SAS token
        String sasToken = blobClient.generateSas(sasValues);

        // Construct the full URL with the SAS token
        return blobClient.getBlobUrl() + "?" + sasToken;
    }

    public void deletePhoto(String blobName) {
        // Get the BlobClient for the blob
        BlobClient blobClient = getContainerClient().getBlobClient(blobName);

        // Delete the blob
        blobClient.delete();
    }

}
