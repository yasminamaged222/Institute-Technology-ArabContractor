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

        //public async Task<CheckoutResponseDto> InitiateCheckoutAsync(Order order)
        //{
        //    try
        //    {
        //        // 1️⃣ Create payload for bank API
        //        var client = _httpClientFactory.CreateClient("BankClient");

        //        var payload = new
        //        {
        //            apiOperation = "INITIATE_CHECKOUT",
        //            interaction = new
        //            {
        //                operation = "PURCHASE",
        //                returnUrl = $"{_settings.ReturnUrl}?orderId={order.Id}"
        //            },
        //            order = new
        //            {
        //                id = order.Id.ToString(),
        //                amount = order.TotalAmount.ToString("F2"),
        //                currency = _settings.Currency
        //            }
        //        };

        //        var json = JsonSerializer.Serialize(payload);
        //        var content = new StringContent(json, Encoding.UTF8, "application/json");
        //        var response = await client.PostAsync(
        //            $"/api/rest/version/{_settings.ApiVersion}/merchant/{_settings.MerchantId}/session", content
        //        );

        //        if (!response.IsSuccessStatusCode)
        //        {
        //            var errorBody = await response.Content.ReadAsStringAsync();
        //            throw new Exception($"Bank API error: {response.StatusCode} - {errorBody}");
        //        }

        //        var responseBody = await response.Content.ReadAsStringAsync();
        //        var bankResult = JsonSerializer.Deserialize<Dictionary<string, object>>(responseBody);

        //        if (bankResult == null || !bankResult.ContainsKey("session"))
        //        {
        //            throw new Exception("Invalid response from Bank API: Missing session data");
        //        }

        //        // The bank returns session as a nested dictionary or object
        //        var sessionObj = bankResult["session"] as JsonElement?;
        //        string sessionId = sessionObj?.GetProperty("id").GetString() ?? throw new Exception("Session ID not found in bank response");

        //        string successIndicator = bankResult.ContainsKey("successIndicator") 
        //            ? bankResult["successIndicator"].ToString() 
        //            : Guid.NewGuid().ToString("N");

        //        // 2️⃣ Construct the DTO for frontend
        //        var firstItem = order.Items?.FirstOrDefault();

        //        var checkoutData = new CheckoutDataDto
        //        {
        //            SessionId = sessionId,
        //            SuccessIndicator = successIndicator,
        //            OrderId = order.Id.ToString(),
        //            CheckoutJsUrl = $"{_settings.BaseUrl}/static/checkout/checkout.min.js",
        //            Course = firstItem != null ? new CourseDto
        //            {
        //                Id = firstItem.Planwork?.ChildId ?? 0,
        //                Title = firstItem.Planwork?.ServiceTitle ?? "Course",
        //                Price = firstItem.Price,
        //                Currency = _settings.Currency
        //            } : null
        //        };

        //        return new CheckoutResponseDto
        //        {
        //            Success = true,
        //            Message = "Checkout session created",
        //            Data = checkoutData
        //        };
        //    }
        //    catch (Exception ex)
        //    {
        //        // Log the exception here if you have a logger
        //        return new CheckoutResponseDto
        //        {
        //            Success = false,
        //            Message = $"Failed to initiate checkout: {ex.Message}",
        //            Data = null
        //        };
        //    }
        //}


        public async Task<CheckoutResponseDto> InitiateCheckoutAsync(Order order)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("BankClient");

                //var payload = new
                //{
                //    apiOperation = "INITIATE_CHECKOUT",
                //    interaction = new
                //    {
                //        operation = "PURCHASE",
                //        returnUrl = $"{_settings.ReturnUrl}?orderId={order.Id}"
                //    },
                //    order = new
                //    {
                //        id = order.Id.ToString(),
                //        amount = order.TotalAmount.ToString("F2"),
                //        currency = _settings.Currency
                //    }
                //};
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
                        id = $"ORD-{order.Id}-{DateTime.UtcNow:yyyyMMddHHmmss}",
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

        //public async Task<bool> VerifyPaymentAsync(string orderId)
        //{
        //    try
        //    {
        //        var client = _httpClientFactory.CreateClient("BankClient");

        //        var response = await client.GetAsync(
        //            $"/api/rest/version/{_settings.ApiVersion}/merchant/{_settings.MerchantId}/order/{orderId}");

        //        if (!response.IsSuccessStatusCode)
        //            return false;

        //        var body = await response.Content.ReadAsStringAsync();

        //        using var doc = JsonDocument.Parse(body);
        //        var root = doc.RootElement;

        //        if (!root.TryGetProperty("result", out var resultProp))
        //            return false;

        //        var result = resultProp.GetString();

        //        if (result != "SUCCESS")
        //            return false;

        //        if (root.TryGetProperty("transaction", out var transactions))
        //        {
        //            foreach (var txn in transactions.EnumerateArray())
        //            {
        //                if (txn.TryGetProperty("transaction", out var innerTxn) && 
        //                    innerTxn.TryGetProperty("status", out var statusProp))
        //                {
        //                    var status = statusProp.GetString();
        //                    if (status == "SUCCESS")
        //                        return true;
        //                }
        //            }
        //        }

        //        return false;
        //    }
        //    catch
        //    {
        //        return false;
        //    }
        //}

        public async Task<bool> VerifyPaymentAsync(string orderId)
        {
            try
            {
                var client = _httpClientFactory.CreateClient("BankClient");

                var response = await client.GetAsync(
                    $"/api/rest/version/{_settings.ApiVersion}/merchant/{_settings.MerchantId}/order/{orderId}"
                );

                if (!response.IsSuccessStatusCode)
                    return false;

                var body = await response.Content.ReadAsStringAsync();
                using var doc = JsonDocument.Parse(body);

                var root = doc.RootElement;

                if (!root.TryGetProperty("result", out var resultProp))
                    return false;

                if (resultProp.GetString() != "SUCCESS")
                    return false;

                if (!root.TryGetProperty("transaction", out var transactions))
                    return false;

                foreach (var txn in transactions.EnumerateArray())
                {
                    if (txn.TryGetProperty("transaction", out var innerTxn))
                    {
                        if (innerTxn.TryGetProperty("status", out var statusProp))
                        {
                            if (statusProp.GetString() == "SUCCESS")
                                return true;
                        }
                    }
                }

                return false;
            }
            catch
            {
                return false;
            }
        }

    }
}
