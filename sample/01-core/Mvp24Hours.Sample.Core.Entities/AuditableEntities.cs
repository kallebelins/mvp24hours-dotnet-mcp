// ======================================================================================
// Mvp24Hours Sample - Auditable Entity Classes
// ======================================================================================

using Mvp24Hours.Core.Contract.Domain.Entity;
using Mvp24Hours.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace Mvp24Hours.Sample.Core.Entities;

// ======================================================================================
// 3. AUDITABLE ENTITY - Using AuditableEntity<TId> (DDD style with audit)
// ======================================================================================

/// <summary>
/// Example of an auditable entity using AuditableEntity with Guid.
/// Automatically tracks creation and modification timestamps.
/// </summary>
public class Product : AuditableEntity<Guid>
{
    [Required]
    [StringLength(200)]
    public string Name { get; private set; } = string.Empty;

    [StringLength(1000)]
    public string? Description { get; private set; }

    public decimal Price { get; private set; }

    public int StockQuantity { get; private set; }

    public bool IsActive { get; private set; } = true;

    private Product() { }

    public Product(string name, decimal price, string? description = null)
    {
        Id = Guid.NewGuid();
        SetName(name);
        SetPrice(price);
        Description = description;
    }

    public void SetName(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name, nameof(name));
        Name = name;
    }

    public void SetPrice(decimal price)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(price, nameof(price));
        Price = price;
    }

    public void UpdateDescription(string? description)
    {
        Description = description;
    }

    public void AddStock(int quantity)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(quantity, nameof(quantity));
        StockQuantity += quantity;
    }

    public void RemoveStock(int quantity)
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(quantity, nameof(quantity));
        if (StockQuantity < quantity)
            throw new InvalidOperationException($"Insufficient stock. Available: {StockQuantity}, Requested: {quantity}");
        StockQuantity -= quantity;
    }

    public void Activate() => IsActive = true;
    public void Deactivate() => IsActive = false;
}

// ======================================================================================
// CONVENIENCE AUDITABLE ENTITY BASES
// ======================================================================================

/// <summary>
/// Example using AuditableGuidEntity - auto-generates GUID with audit tracking.
/// </summary>
public class BlogPost : AuditableGuidEntity
{
    [Required]
    [StringLength(200)]
    public string Title { get; private set; } = string.Empty;

    [Required]
    public string Content { get; private set; } = string.Empty;

    [StringLength(500)]
    public string? Summary { get; private set; }

    public bool IsPublished { get; private set; }

    public DateTime? PublishedAt { get; private set; }

    private BlogPost() : base() { }

    public BlogPost(string title, string content, string? summary = null) : base()
    {
        SetTitle(title);
        SetContent(content);
        Summary = summary;
    }

    public void SetTitle(string title)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(title, nameof(title));
        Title = title;
    }

    public void SetContent(string content)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(content, nameof(content));
        Content = content;
    }

    public void Publish()
    {
        if (!IsPublished)
        {
            IsPublished = true;
            PublishedAt = DateTime.UtcNow;
        }
    }

    public void Unpublish()
    {
        IsPublished = false;
        PublishedAt = null;
    }
}

/// <summary>
/// Example using AuditableIntEntity - integer ID with audit tracking.
/// </summary>
public class SystemSetting : AuditableIntEntity
{
    [Required]
    [StringLength(100)]
    public string Key { get; set; } = string.Empty;

    [Required]
    public string Value { get; set; } = string.Empty;

    [StringLength(500)]
    public string? Description { get; set; }

    public SystemSetting() { }

    public SystemSetting(string key, string value, string? description = null)
    {
        Key = key;
        Value = value;
        Description = description;
    }
}

/// <summary>
/// Example using AuditableLongEntity - long ID with audit tracking.
/// </summary>
public class TransactionRecord : AuditableLongEntity
{
    public string TransactionId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "BRL";
    public TransactionType Type { get; set; }
    public string? Reference { get; set; }
}

public enum TransactionType
{
    Credit,
    Debit,
    Transfer
}