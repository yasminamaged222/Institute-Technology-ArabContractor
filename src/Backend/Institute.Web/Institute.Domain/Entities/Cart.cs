using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Institute.Domain.Entities
{
    public class Cart
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public AppUser User { get; set; }        // Navigation
        public DateTime? CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsCheckedOut { get; set; } = false;
        public ICollection<CartItem> Items { get; set; }        // Navigation


    }
}
