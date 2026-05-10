using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Institute.Application.Interfaces.IService;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class BlobStorage : IBlobStorage
    {
        private readonly string _connectionString;

        public BlobStorage(IConfiguration configuration)
        {
            _connectionString =
                configuration["AzureBlobStorage:ConnectionString"]!;
        }

        public async Task<string> UploadFileAsync(
    IFormFile file,
    string containerName,
    string folderName)
        {
            var containerClient = new BlobContainerClient(_connectionString, containerName);

            await containerClient.CreateIfNotExistsAsync();

            var originalFileName = Path.GetFileName(file.FileName);

            var blobName = $"{folderName}/{originalFileName}";

            var blobClient = containerClient.GetBlobClient(blobName);

            using var stream = file.OpenReadStream();

            var blobHttpHeader = new BlobHttpHeaders
            {
                ContentType = file.ContentType // 🔥 أهم سطر
            };

            await blobClient.UploadAsync(stream, new BlobUploadOptions
            {
                HttpHeaders = blobHttpHeader
            });

            return originalFileName;
        }

        //    public async Task<string> UploadFileAsync(
        //IFormFile file,
        //string containerName,
        //string folderName)
        //    {
        //        var containerClient = new BlobContainerClient(_connectionString, containerName);

        //        await containerClient.CreateIfNotExistsAsync();

        //        // 👇 الاسم الأصلي زي ما هو
        //        var originalFileName = Path.GetFileName(file.FileName);

        //        var blobName = $"{folderName}/{originalFileName}";

        //        var blobClient = containerClient.GetBlobClient(blobName);

        //        using var stream = file.OpenReadStream();

        //        await blobClient.UploadAsync(stream, overwrite: true); // مهم جدًا

        //        return blobName;
        //    }

    }
}
