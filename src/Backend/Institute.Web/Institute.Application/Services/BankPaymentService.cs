using Institute.API.DTOs;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Net.Http;
using Microsoft.Extensions.Options;
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

        public async Task<string> InitiateCheckoutAsync(int orderId, decimal amount)
        {
            var client = _httpClientFactory.CreateClient("BankClient");

            var payload = new
            {
                apiOperation = "INITIATE_CHECKOUT",
                interaction = new
                {
                    operation = "PURCHASE",
                    returnUrl = $"{_settings.ReturnUrl}?orderId={orderId}"
                },
                order = new
                {
                    id = orderId.ToString(),
                    amount = amount.ToString("F2"),
                    currency = _settings.Currency
                }
            };

            var json = JsonSerializer.Serialize(payload);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            var response = await client.PostAsync($"/api/rest/version/{_settings.ApiVersion}/merchant/{_settings.MerchantId}/session", content);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<Dictionary<string, object>>(responseBody);

            return result["redirectUrl"].ToString(); // رابط صفحة الدفع الحقيقية
        }

        public async Task<bool> VerifyPaymentAsync(string orderId)
        {
            var client = _httpClientFactory.CreateClient("BankClient");
            var response = await client.GetAsync($"/api/rest/version/{_settings.ApiVersion}/merchant/{_settings.MerchantId}/order/{orderId}");
            response.EnsureSuccessStatusCode();

            var body = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<Dictionary<string, object>>(body);

            return result["status"].ToString() == "CAPTURED"; // الدفع ناجح؟
        }
    }
}
