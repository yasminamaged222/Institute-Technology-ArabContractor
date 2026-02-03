namespace Institute.API.DTOs
{
    public class CreateOrderDto
    {
        public int UserId { get; set; }
        public List<int> PlanworkIds { get; set; }
    }
}
