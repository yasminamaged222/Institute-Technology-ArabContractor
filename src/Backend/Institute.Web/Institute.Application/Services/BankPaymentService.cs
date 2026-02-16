using Institute.API.DTOs;
using Institute.Domain.Entities;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Institute.Application.Services
{
    public class BankPaymentService
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly PaymentSettings _settings;

        public BankPaymentService(IHttpClientFactory httpClientFactory, IOptions<PaymentSettings> options)
        {
            _httpClientFactory = httpClientFactory;
            _settings = options.Value;
        }

        public async Task<CheckoutResponseDto> InitiateCheckoutAsync(Order order)
        {
            // 1️⃣ Create payload for bank API
            var client = _httpClientFactory.CreateClient("BankClient");

            var payload = new
            {
                apiOperation = "INITIATE_CHECKOUT",
                interaction = new
                {
                    operation = "PURCHASE",
                    returnUrl = $"{_settings.ReturnUrl}?orderId={order.Id}"
                },
                order = new
                {
                    id = order.Id.ToString(),
                    amount = order.TotalAmount.ToString("F2"),
                    currency = _settings.Currency
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await client.PostAsync(
                $"/api/rest/version/{_settings.ApiVersion}/merchant/{_settings.MerchantId}/session", content
            );

            response.EnsureSuccessStatusCode();
            var responseBody = await response.Content.ReadAsStringAsync();
            var bankResult = JsonSerializer.Deserialize<Dictionary<string, object>>(responseBody);

            // 2️⃣ Construct the DTO for frontend
            var checkoutData = new CheckoutDataDto
            {
                SessionId = bankResult["sessionId"]?.ToString() ?? Guid.NewGuid().ToString("N"),
                SuccessIndicator = bankResult["successIndicator"]?.ToString() ?? Guid.NewGuid().ToString("N"),
                OrderId = order.Id.ToString(),
                CheckoutJsUrl = "https://banquemisr.gateway.mastercard.com/static/checkout/checkout.min.js",
                Course = order.Items.Select(i => new CourseDto
                {
                    Id = i.Planwork.ChildId,
                    Title = i.Planwork.ServiceTitle,
                    Price = i.Price,
                    Currency = _settings.Currency
                }).FirstOrDefault() // Assuming 1 course per order
            };

            return new CheckoutResponseDto
            {
                Success = true,
                Message = "Checkout session created",
                Data = checkoutData
            };
        }

        // DTOs

        public class CheckoutResponseDto
        {
            public bool Success { get; set; }
            public string Message { get; set; }
            public CheckoutDataDto Data { get; set; }
        }

        public class CheckoutDataDto
        {
            public string SessionId { get; set; }
            public string SuccessIndicator { get; set; }
            public string OrderId { get; set; }
            public string CheckoutJsUrl { get; set; }
            public CourseDto Course { get; set; }
        }

        public class CourseDto
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public decimal Price { get; set; }
            public string Currency { get; set; }
        }
        public async Task<bool> VerifyPaymentAsync(string orderId)
        {
            var client = _httpClientFactory.CreateClient("BankClient");

            var response = await client.GetAsync(
                $"/api/rest/version/{_settings.ApiVersion}/merchant/{_settings.MerchantId}/order/{orderId}");

            if (!response.IsSuccessStatusCode)
                return false;

            var body = await response.Content.ReadAsStringAsync();

            using var doc = JsonDocument.Parse(body);
            var root = doc.RootElement;

            var result = root.GetProperty("result").GetString();

            if (result != "SUCCESS")
                return false;

            var transactions = root.GetProperty("transaction");

            foreach (var txn in transactions.EnumerateArray())
            {
                var status = txn.GetProperty("transaction").GetProperty("status").GetString();

                if (status == "SUCCESS")
                    return true;
            }

            return false;
        }


        //public async Task<bool> VerifyPaymentAsync(string orderId)
        //{
        //    var client = _httpClientFactory.CreateClient("BankClient");
        //    var response = await client.GetAsync($"/api/rest/version/{_settings.ApiVersion}/merchant/{_settings.MerchantId}/order/{orderId}");
        //    response.EnsureSuccessStatusCode();

        //    var body = await response.Content.ReadAsStringAsync();
        //    var result = JsonSerializer.Deserialize<Dictionary<string, object>>(body);

        //    return result["status"].ToString() == "CAPTURED"; // الدفع ناجح؟
        //}
    }
}
