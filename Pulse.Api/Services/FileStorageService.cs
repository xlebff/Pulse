namespace Pulse.Api.Services
{
    public class FileStorageService
    {
        private readonly string _uploadsRoot;
        private static readonly string[] AllowedMime =
        {
            "image/jpeg", "image/png", "image/webp", "image/gif"
        };

        public FileStorageService(IWebHostEnvironment env)
        {
            _uploadsRoot = Path.Combine(env.ContentRootPath, "uploads");
            Directory.CreateDirectory(_uploadsRoot);
        }

        public async Task<(bool Ok, string Error, string RelativePath, string SafeName)> SaveAsync(
            IFormFile file, CancellationToken ct = default)
        {
            if (file is null || file.Length == 0)
                return (false, "Файл пуст", "", "");

            if (!AllowedMime.Contains(file.ContentType))
                return (false, "Разрешены только изображения (jpg, png, webp, gif)", "", "");

            var ext = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (ext is not (".jpg" or ".jpeg" or ".png" or ".webp" or ".gif"))
                return (false, "Недопустимое расширение файла", "", "");

            var safeName = $"{Guid.NewGuid():N}{ext}";
            var fullPath = Path.Combine(_uploadsRoot, safeName);

            await using var stream = File.Create(fullPath);
            await file.CopyToAsync(stream, ct);

            return (true, "", $"/uploads/{safeName}", safeName);
        }

        public void Delete(string? relativePath)
        {
            if (string.IsNullOrWhiteSpace(relativePath)) return;

            var fileName = Path.GetFileName(relativePath);
            if (string.IsNullOrWhiteSpace(fileName)) return;

            var fullPath = Path.Combine(_uploadsRoot, fileName);
            if (File.Exists(fullPath)) File.Delete(fullPath);
        }
    }
}