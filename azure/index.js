'use strict';
const { BlobServiceClient, BlobSASPermissions } = require('@azure/storage-blob');

class Azure{
  static async syncSetting(containerName=process.env.AZURE_STORAGE_CONTAINER) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    //blobServiceClient.setProperties(
    //  {cors: [{ allowedOrigins : process.env.URL, allowedMethods: 'OPTIONS,PUT,POST,GET', allowedHeaders:'*', exposedHeaders: '*', maxAgeInSeconds: 7200}]});

    const containerClient = blobServiceClient.getContainerClient(containerName);
    await containerClient.createIfNotExists();

    const currentSettings = await blobServiceClient.getProperties();
    
    const mergedCors = currentSettings.cors.concat([
      { allowedOrigins : process.env.URL, allowedMethods: 'OPTIONS,PUT,POST,GET', allowedHeaders:'*', exposedHeaders: '*', maxAgeInSeconds: 7200},
      { allowedOrigins : process.env.BACKENDURL, allowedMethods: 'OPTIONS,PUT,POST,GET', allowedHeaders:'*', exposedHeaders: '*', maxAgeInSeconds: 7200}
    ]);

    await blobServiceClient.setProperties({ cors: mergedCors });
  }
  static async deleteBlob(blobName, containerName=process.env.AZURE_STORAGE_CONTAINER) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const containerBlobClient = containerClient.getBlockBlobClient(blobName);

    await containerBlobClient.deleteIfExists();
  }
  static async checkBlobExists(blobName, containerName=process.env.AZURE_STORAGE_CONTAINER) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const containerBlobClient = containerClient.getBlockBlobClient(blobName);
    return await containerBlobClient.exists();
  }
  static async generateSAS(blobName, type = 'w', filename=null, containerName=process.env.AZURE_STORAGE_CONTAINER) {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    const containerClient = blobServiceClient.getContainerClient(containerName); 
    const containerBlobClient = containerClient.getBlockBlobClient(blobName);
  
    const expiresOn = new Date(Date.now() + 86400 * 1000);
    const startsOn = new Date(Date.now() - 1000);

    let config = {
      permissions: BlobSASPermissions.parse(type),
      expiresOn: expiresOn,
      startsOn: startsOn,
    };
    //add filename if available
    if(filename){
      config['contentDisposition'] = `attachment; filename="${ filename }"`;
    }
    const sasBaseUrl = await containerBlobClient.generateSasUrl(config);
    
    return {
      url: sasBaseUrl,
      expiresOn,
      startsOn
    };
  }
}

module.exports = Azure;