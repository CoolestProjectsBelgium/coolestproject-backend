'use strict';
const { BlobServiceClient, BlobSASPermissions } = require('@azure/storage-blob');

class Azure{
  static async deleteBlob(blobName) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    blobServiceClient.setProperties(
      {cors: [{ allowedOrigins : process.env.URL, allowedMethods: 'OPTIONS,PUT,POST,GET', allowedHeaders:'*', exposedHeaders: '*', maxAgeInSeconds: 7200}]});

    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER);
    const containerBlobClient = containerClient.getBlockBlobClient(blobName);
    await containerBlobClient.delete();

  }
  static async generateSAS(blobName, type = 'w') {
    
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    blobServiceClient.setProperties(
      {cors: [{ allowedOrigins : process.env.URL, allowedMethods: 'OPTIONS,PUT,POST,GET', allowedHeaders:'*', exposedHeaders: '*', maxAgeInSeconds: 7200}]});

    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER);
    containerClient.createIfNotExists();
          
    const containerBlobClient = containerClient.getBlockBlobClient(blobName);
  
    const expiresOn = new Date(Date.now() + 86400 * 1000);
    const startsOn = new Date(Date.now() - 1000);
  
    //just create empty blob & generate write access url
    const sasBaseUrl = await containerBlobClient.generateSasUrl({
      permissions: BlobSASPermissions.parse(type),
      expiresOn: expiresOn,
      startsOn: startsOn
    });
    
    return {
      url: sasBaseUrl,
      expiresOn,
      startsOn
    };
  }
}

module.exports = Azure;