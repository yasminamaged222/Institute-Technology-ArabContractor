namespace Institute.API.Helpers
{
    public class Pagination<T>
    {
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
        public IReadOnlyList<T> Data { get; set; } = new List<T>();

        public Pagination(int pageIndex, int pageSize, int totalItems, IReadOnlyList<T> data)
        {
            PageIndex = pageIndex;
            PageSize = pageSize;
            TotalItems = totalItems;
            TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize);
            Data = data;
        }

    }
}
