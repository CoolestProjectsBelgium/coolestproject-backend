// Script to test if the local azure blob store is working
// !!! You need to change the IP address and KPI path !!!
// I have issues with integrating the lib with traefik SSL Forwarding is not working for the moment
// 1) I'm getting a 400 with a tcp connection closed when using the SSL forwarding with TCP router
// 2) If I try to do SSL offloading in traefik the Container doesn't work

// first step is to generate a random file (smaller than the max buffer size -> 1G is more than sufficient for our test cases)
// then upload the file & download them 
// head -c 1G </dev/urandom >testfile
// cmp testfile resultfile

const { BlobServiceClient, BlobSASPermissions } = require('@azure/storage-blob');
const { v1: uuidv1 } = require('uuid');
const axios = require('axios');
const fs = require('fs');
const https = require('https');
const { create } = require('xmlbuilder2');
const crypto = require('crypto');
const testFile = './testfile';
const testResultFile = './resultfile';

const AZURE_STORAGE_CONNECTION_STRING='DefaultEndpointsProtocol=https;AccountName=account1.blob.coolestazure;AccountKey=key1;BlobEndpoint=https://account1.blob.coolestazure.localhost:10000;QueueEndpoint=https://account1.blob.coolestazure.localhost:10001;';

// process.env['NODE_EXTRA_CA_CERTS'] = '/home/erik/coolestproject/configuration/certs/pki/ca.crt';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const axiosInstance = axios.create({
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false
  })
});

class Block {
  constructor(id, start, end, buffer) {
    this.id = id;
    this.start = start;
    this.end = end;
    this.buffer = buffer;
    this.error = null;
    this.status = -1;
  }
  calculateCRC(){
    return crypto.createHash('md5').update(this.buffer).digest('base64');
  }
  setStatus(status, error){
    this.status = status;
    this.error = error;
  }
}

async function main() {

  // backend
  const containerName = 'thumbnails';
  const blobName = 'random123456';
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
  const containerClient = blobServiceClient.getContainerClient(containerName);
  containerClient.createIfNotExists();
  const containerBlobClient = containerClient.getBlockBlobClient(blobName);

  await containerBlobClient.upload('', 0);
  const base_url = await containerBlobClient.generateSasUrl({
    permissions: BlobSASPermissions.parse('w'),
    //expiresOn: new Date(Date.now() + 86400 * 1000)
    expiresOn: '2021-02-22T21:04:35Z'
  });
  console.log(base_url);

  //frontend
  const sendList = [];
  const blockSize = 10240000;
  const formData = fs.readFileSync(testFile); //for this tests we only test with smaller files
  const block = Math.floor(formData.byteLength / blockSize);
  const rest = formData.byteLength % blockSize;
  const maxBlockLength = ((block + 1) + '').length;
  const retryNo = 5;

  function generateBlockId(i){
    return encodeURIComponent(Buffer.from((i+'').padStart(maxBlockLength,'0')).toString('base64'));
  }

  async function putBlock(b){
    let url = base_url + `&blockid=${b.id}&comp=block`;
    try {
      const res = await axiosInstance.put(url, b.buffer, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          'x-ms-content-MD5': b.calculateCRC(),
          'x-ms-blob-type': 'BlockBlob',
          'Content-Type': 'application/octet-stream'
        }
      });
      b.setStatus(res.status);
      console.debug(`${res.status} status`);
      console.debug(`${b.id} ok`);
    } catch(error) {
      console.error(error);
      b.setStatus(error.status, error.data.error);
    }
  }

  async function putBlocksToBackend(sendList){
    await Promise.all(sendList.map(putBlock));
  }

  async function putBlockListToBackend(sendList){
    // send block success
    const blockListXML = create({ version: '1.0', encoding:'utf-8' }).ele('BlockList');
    for(const b of sendList){
      blockListXML.ele('Latest').txt(b.id);
    }
    const url = base_url + '&comp=blocklist';
    const blockXML = blockListXML.end();
    try {
      await axios.put(url, blockXML, {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: { 'Content-Type': 'application/text-plain' }
      });
      console.debug('confirm blocks');
    } catch(error) {
      console.error(error);
    }
  }

  console.log('start loading');

  // prepare slices
  for (let i = 0; i < block; i++) {
    let blockId = generateBlockId(i);
    let start = i * blockSize;
    let end = (i * blockSize) + blockSize;
    let slice = formData.slice(start, end);
    
    sendList.push(new Block(blockId, start, end, slice));
  }
  if(rest > 0){   
    let blockId = generateBlockId(block);
    let start = block * blockSize;
    let end = formData.byteLength;
    let slice = formData.slice(block * blockSize, formData.byteLength);

    sendList.push(new Block(blockId, start, end, slice));
  }

  for(let c = 0; c < retryNo; c++){
    const listTobeProcessed = sendList.filter(b => b.status != 201);
    // nothing todo
    if(listTobeProcessed.length == 0){
      break;
    }
    await putBlocksToBackend(listTobeProcessed);
  }

  //only confirm when no error was found
  const hasError = sendList.find(b => b.status != 201);
  if(hasError === undefined){
    await putBlockListToBackend(sendList);
  } else{
    console.error(`One of the blocks failed ${ hasError.id }`);
  }

  // get url to download
  const download_url = await containerBlobClient.generateSasUrl({
    permissions:  BlobSASPermissions.parse('r'),
    expiresOn: new Date(Date.now() + 86400 * 1000),
  });
  console.log(download_url);

  const file = await axiosInstance.get(download_url, { responseType: 'stream' });
  file.data.pipe(fs.createWriteStream(testResultFile));
}
main().then(() => console.log('Done')).catch((ex) => console.log(ex));
