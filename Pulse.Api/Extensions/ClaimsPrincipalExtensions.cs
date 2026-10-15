using System.Security.Claims;

namespace Pulse.Shared.Extensions
{
    public static class ClaimsPrincipalExtensions
    {
        public static Guid GetUserId(this ClaimsPrincipal user)
        {
            var id = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return Guid.TryParse(id, out var g) ? g : Guid.Empty;
        }

        public static string GetRole(this ClaimsPrincipal user)
            => user.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
    }
}