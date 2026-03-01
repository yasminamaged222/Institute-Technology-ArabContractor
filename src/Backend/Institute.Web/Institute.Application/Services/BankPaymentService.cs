using Institute.API.DTOs;
using Institute.Domain.Entities;
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
            try
            {
                var client = _httpClientFactory.CreateClient("BankClient");
                var payload = new
                {
                    apiOperation = "INITIATE_CHECKOUT",
                    interaction = new
                    {
                        operation = "PURCHASE",
                        returnUrl = $"{_settings.ReturnUrl}?orderId={order.Id}",
                        cancelUrl = "https://localhost:5173/checkout", // ✅ URL حقيقي
                        merchant = new
                        {
                            name = _settings.MerchantName
                        },
                        displayControl = new
                        {
                            billingAddress = "HIDE",
                            customerEmail = "HIDE"
                        }
                    },
                    order = new
                    {
                        id = order.OrderNumber,
                        amount = order.TotalAmount.ToString("F2"),
                        currency = _settings.Currency,
                        description = $"Order #{order.Id}"
                    }
                };
                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var response = await client.PostAsync(
                    $"/api/rest/version/{_settings.ApiVersion}/merchant/{_settings.MerchantId}/session",
                    content
                );

                if (!response.IsSuccessStatusCode)
                {
                    var error = await response.Content.ReadAsStringAsync();
                    throw new Exception(error);
                }

                var body = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(body);

                var root = doc.RootElement;

                var sessionId = root
                    .GetProperty("session")
                    .GetProperty("id")
                    .GetString();

                var successIndicator = root
                    .GetProperty("successIndicator")
                    .GetString();
                order.GatewaySessionId = sessionId;
                order.SuccessIndicator = successIndicator;

                return new CheckoutResponseDto
                {
                    Success = true,
                    Message = "Session created successfully",
                    Data = new CheckoutDataDto
                    {
                        SessionId = sessionId,
                        SuccessIndicator = successIndicator,
                        OrderId = order.Id.ToString(),
                        //CheckoutJsUrl =
                        //    $"{_settings.BaseUrl}/checkout/version/{_settings.ApiVersion}/checkout.js"
                        CheckoutJsUrl = $"{_settings.BaseUrl}/static/checkout/checkout.min.js"
                    }
                };
            }
            catch (Exception ex)
            {
                return new CheckoutResponseDto
                {
                    Success = false,
                    Message = ex.Message,
                    Data = null
                };
            }
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



        public async Task<(bool IsSuccess, string? GatewayResponse)>
            RefundPaymentAsync(string orderNumber, string transactionId, decimal amount)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("BankClient");

                // Basic Auth
                var authBytes = Encoding.ASCII.GetBytes($"merchant.{_settings.MerchantId}:{_settings.ApiPassword}");
                client.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Basic", Convert.ToBase64String(authBytes));

                // Refund transaction ID (must be unique)
                var refundTransactionId = $"refund-{Guid.NewGuid():N}";

                var payload = new
                {
                    apiOperation = "REFUND",
                    transaction = new
                    {
                        amount = amount.ToString("F2"),
                        currency = _settings.Currency
                    }
                };

                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                var url = $"/api/rest/version/{_settings.ApiVersion}/merchant/{_settings.MerchantId}" +
                          $"/order/{orderNumber}/transaction/{refundTransactionId}";

                var response = await client.PutAsync(url, content);
                var body = await response.Content.ReadAsStringAsync();

                if (!response.IsSuccessStatusCode)
                    return (false, body);

                using var doc = JsonDocument.Parse(body);
                var root = doc.RootElement;
                var result = root.TryGetProperty("result", out var r) ? r.GetString() : null;

                return (result == "SUCCESS", body);
            }
            catch (Exception ex)
            {
                return (false, ex.Message);
            }
        }

        public async Task<(bool IsSuccess, string? SuccessIndicator, string? GatewayResponse)>
            VerifyPaymentAsync(string orderNumber)
        {
            try
            {
                // 1️⃣ URL endpoint للبنك
                var url = $"{_settings.BaseUrl}/api/rest/version/{_settings.ApiVersion}/merchant/{_settings.MerchantId}/order/{orderNumber}";

                var client = _httpClientFactory.CreateClient("BankClient");

                // 2️⃣ Authorization Basic
                var authBytes = Encoding.ASCII.GetBytes($"merchant.{_settings.MerchantId}:{_settings.ApiPassword}");
                client.DefaultRequestHeaders.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(authBytes));

                // 3️⃣ Call GET
                var response = await client.GetAsync(url);

                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    return (false, null, errorContent);
                }

                // 4️⃣ Parse JSON
                var body = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(body);
                var root = doc.RootElement;

                // 5️⃣ Extract result
                var result = root.GetProperty("result").GetString();
                bool isSuccess = result == "SUCCESS";

                // 6️⃣ Extract successIndicator
                string? successIndicator = null;
                if (root.TryGetProperty("successIndicator", out var indicatorProp))
                {
                    successIndicator = indicatorProp.GetString();
                }

                return (isSuccess, successIndicator, body);
            }
            catch (Exception ex)
            {
                return (false, null, ex.Message);
            }
        }

    }
}