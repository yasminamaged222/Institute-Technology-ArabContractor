namespace Institute.API.DTOs.PaymentDtos
{
    public class CheckoutRequestDto
    {
        public int CartId { get; set; }
        public string PaymentMethod { get; set; } // e.g., "CreditCard", "PayPal"
    }
}
