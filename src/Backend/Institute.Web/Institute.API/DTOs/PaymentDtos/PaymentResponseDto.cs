namespace Institute.API.DTOs.PaymentDtos
{
    public class PaymentResponseDto
    {
        public int OrderId { get; set; }
        public string TransactionRef { get; set; }
        public bool IsSuccess { get; set; }
        public string GatewayResponse { get; set; }
    }
}
