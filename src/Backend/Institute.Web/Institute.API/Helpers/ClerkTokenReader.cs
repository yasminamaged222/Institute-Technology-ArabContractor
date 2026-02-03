using System.IdentityModel.Tokens.Jwt;

namespace Institute.API.Helpers
{
    public static class ClerkTokenReader
    {
        public static string? GetClerkUserId(string bearerToken)
        {
            if (string.IsNullOrEmpty(bearerToken))
                return null;

            if (bearerToken.StartsWith("Bearer "))
                bearerToken = bearerToken.Replace("Bearer ", "");

            var handler = new JwtSecurityTokenHandler();
            var jwt = handler.ReadJwtToken(bearerToken);

            return jwt.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
        }
    }
}
