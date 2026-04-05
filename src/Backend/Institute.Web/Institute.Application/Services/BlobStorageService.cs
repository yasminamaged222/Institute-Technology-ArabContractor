//using Institute.Application.Interfaces.IService;
//using Microsoft.AspNetCore.Http;
//using Microsoft.Extensions.Configuration;
//using System;
//using System.Collections.Generic;
//using System.Linq;
//using System.Text;
//using System.Threading.Tasks;

//namespace Institute.Application.Services
//{
//    public class BlobStorageService : IBlobStorageService
//    {
//        private readonly BlobContainerClient _container;

//        public BlobStorageService(IConfiguration config)
//        {
//            var connStr = config["AzureStorage:ConnectionString"];
//            var containerName = config["AzureStorage:ContainerName"];
//            _container = new BlobContainerClient(connStr, containerName);
//            _container.CreateIfNotExists(PublicAccessType.Blob);
//        }

//        public async Task<string> UploadAsync(IFormFile file, string folder = "certificates")
//        {
//            var fileName = $"{folder}/{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
//            var blob = _container.GetBlobClient(fileName);

//            using var stream = file.OpenReadStream();
//            await blob.UploadAsync(stream, new BlobHttpHeaders
//            {
//                ContentType = file.ContentType
//            });

//            return blob.Uri.ToString(); // URL كامل ثابت
//        }

//        public async Task DeleteAsync(string fileUrl)
//        {
//            if (string.IsNullOrEmpty(fileUrl)) return;
//            var uri = new Uri(fileUrl);
//            var blobName = string.Join("/", uri.Segments.Skip(2));
//            var blob = _container.GetBlobClient(blobName);
//            await blob.DeleteIfExistsAsync();
//        }
//    }
//}
//
