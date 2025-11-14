using System.ComponentModel.DataAnnotations;

namespace Server.DTOs;

public sealed class CustomerDto
{
    [Required(ErrorMessage = "Customer name is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Customer name must be between 2 and 100 characters")]
    public required string CustomerName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Amount is required")]
    [Range(0.01, double.MaxValue, ErrorMessage = "Amount must be greater than 0")]
    public required decimal Amount { get; set; } = 0m;
}