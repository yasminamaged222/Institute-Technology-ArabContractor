namespace Institute.API.DTOs
{
    public class BankMisrOptions
    {
        public string BaseUrl { get; set; } = default!;
        public string MerchantId { get; set; } = default!;
        public string ApiUsername { get; set; } = default!;
        public string ApiPassword { get; set; } = default!;
        public string ApiVersion { get; set; } = default!;
        public string ReturnUrl { get; set; } = default!;
    }
}
