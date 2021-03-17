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
  static async generateSAS(blobName, type = 'w', filename=null) {
    
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_STORAGE_CONNECTION_STRING);
    blobServiceClient.setProperties(
      { cors: [{ allowedOrigins : process.env.URL, allowedMethods: 'OPTIONS,PUT,POST,GET', allowedHeaders:'*', exposedHeaders: '*', maxAgeInSeconds: 7200}]});

    const containerClient = blobServiceClient.getContainerClient(process.env.AZURE_STORAGE_CONTAINER);
    containerClient.createIfNotExists();
          
    const containerBlobClient = containerClient.getBlockBlobClient(blobName);
  
    const expiresOn = new Date(Date.now() + 86400 * 1000);
    const startsOn = new Date(Date.now() - 1000);
  
    //just create empty blob & generate write access url
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