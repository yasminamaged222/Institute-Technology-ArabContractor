using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Institute.Application.Services;


namespace Institute.Application.Services
{
    using Institute.API.DTOs;
    using Microsoft.Extensions.Options;
    using System.Net.Http.Headers;
    using System.Net.Http.Json;
    using System.Text;
    using System.Text.Json;

    public class BankMisrPaymentService
    {
        private readonly HttpClient _http;
        private readonly BankMisrOptions _opt;

        public BankMisrPaymentService(HttpClient http, IOptions<BankMisrOptions> opt)
        {
            _http = http;
            _opt = opt.Value;
        }

        public async Task<string> CreateCheckoutSessionAsync(
            string orderNumber, decimal amount, string currency)
        {
            var auth = Convert.ToBase64String(
                Encoding.UTF8.GetBytes($"{_opt.ApiUsername}:{_opt.ApiPassword}")
            );

            _http.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Basic", auth);

            var body = new
            {
                apiOperation = "CREATE_CHECKOUT_SESSION",
                interaction = new
                {
                    operation = "PURCHASE",
                    returnUrl = _opt.ReturnUrl
                },
                order = new
                {
                    id = orderNumber,
                    amount = amount,
                    currency = currency
                }
            };

            var url =
                $"{_opt.BaseUrl}/api/rest/version/{_opt.ApiVersion}/merchant/{_opt.MerchantId}/session";

            var res = await _http.PostAsJsonAsync(url, body);
            res.EnsureSuccessStatusCode();

            using var stream = await res.Content.ReadAsStreamAsync();
            var json = await JsonDocument.ParseAsync(stream);

            return json.RootElement
                       .GetProperty("session")
                       .GetProperty("id")
                       .GetString()!;
        }
    }
}
