namespace Pulse.Api.Middleware;

public class AdminKeyMiddleware(RequestDelegate next, IConfiguration config)
{
    private readonly RequestDelegate _next = next;
    private readonly string _adminKey = config["Admin:Key"] ?? "admin";

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.Request.Path.StartsWithSegments("/api/admin"))
        {
            var key = context.Request.Headers["X-Admin-Key"].ToString();
            if (key != _adminKey)
            {
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsJsonAsync(new { error = "Доступ только для администратора" });
                return;
            }
        }

        await _next(context);
    }
}