namespace neon_club_api.Extensions
{
    public static class StringValidationExtensions
    {
        public static void NullOrEmptyValidation(this string value,
                                                 ref bool isValid,
                                                 ref string message)
        {
            if (String.IsNullOrEmpty(value))
            {
                isValid = false;
                message += $"Invalid {nameof(value)}: at least one symbol required.\n";
            }
        }
    }
}
