using System.Numerics;

namespace neon_club_api.Extensions
{
    public static class NumericValidationExtension
    {
        public static void IsInRangeValidation<T>(this T value, 
            T min, 
            T max,
            ref bool isValid,
            ref string message) 
            where T : INumber<T>
        {
            if (value is null)
            {
                isValid = false;
                message += $"Invalid {nameof(value)}: cannot be null";
                return;
            }

            if (min is null || max is null)
            {
                isValid = false;
                message += $"Invalid {nameof(min)} or {nameof(max)}: cannot be null";
                return;
            }

            if (max < min)
            {
                isValid = false;
                message += $"Invalid {nameof(min)} or {nameof(max)}: {nameof(max)} must be greated than {nameof(min)}";
                return;
            }

            if (value < min)
            {
                isValid = false;
                message += $"Invalid {nameof(value)}: {nameof(value)} must be greated than {nameof(min)}";
                return;
            }

            if (value > max)
            {
                isValid = false;
                message += $"Invalid {nameof(value)}: {nameof(value)} must be less than {nameof(max)}";
                return;
            }
        }
    }
}
