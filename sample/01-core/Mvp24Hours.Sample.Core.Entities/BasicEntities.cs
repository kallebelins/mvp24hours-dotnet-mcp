// ======================================================================================
// Mvp24Hours Sample - Entity Base Classes
// ======================================================================================
// This sample demonstrates the different entity base classes available in Mvp24Hours.Core
// ======================================================================================

using Mvp24Hours.Core.Contract.Domain.Entity;
using Mvp24Hours.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace Mvp24Hours.Sample.Core.Entities;

// ======================================================================================
// 1. BASIC ENTITY - Using EntityBase<TId> from Domain.Entities (DDD style)
// ======================================================================================

/// <summary>
/// Example of a simple entity using EntityBase with Guid.
/// This is the recommended approach for DDD-style domain modeling.
/// </summary>
public class Customer : EntityBase<Guid>
{
    [Required]
    [StringLength(100)]
    public string Name { get; private set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; private set; } = string.Empty;

    [StringLength(20)]
    public string? Phone { get; private set; }

    private Customer() { }

    public Customer(string name, string email, string? phone = null)
    {
        Id = Guid.NewGuid();
        SetName(name);
        SetEmail(email);
        Phone = phone;
    }

    public void SetName(string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name, nameof(name));
        Name = name;
    }

    public void SetEmail(string email)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(email, nameof(email));
        Email = email;
    }

    public void UpdatePhone(string? phone)
    {
        Phone = phone;
    }
}

// ======================================================================================
// 2. CONVENIENCE ENTITY BASES - Using typed base classes
// ======================================================================================

/// <summary>
/// Example using GuidEntityBase - auto-generates GUID on creation.
/// </summary>
public class Order : GuidEntityBase
{
    public string OrderNumber { get; private set; } = string.Empty;
    public DateTime OrderDate { get; private set; }
    public decimal Total { get; private set; }
    public OrderStatus Status { get; private set; } = OrderStatus.Pending;

    private Order() : base() { }

    public Order(string orderNumber, decimal total) : base()
    {
        OrderNumber = orderNumber;
        OrderDate = DateTime.UtcNow;
        Total = total;
    }

    public void Complete() => Status = OrderStatus.Completed;
    public void Cancel() => Status = OrderStatus.Cancelled;
}

/// <summary>
/// Example using IntEntityBase - for database-generated integer IDs.
/// </summary>
public class Category : IntEntityBase
{
    [Required]
    [StringLength(50)]
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public Category() { }

    public Category(string name, string? description = null)
    {
        Name = name;
        Description = description;
    }
}

/// <summary>
/// Example using LongEntityBase - for large datasets with auto-increment.
/// </summary>
public class AuditLog : LongEntityBase
{
    public string Action { get; set; } = string.Empty;
    public string EntityType { get; set; } = string.Empty;
    public string EntityId { get; set; } = string.Empty;
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    public string? UserId { get; set; }
    public string? Details { get; set; }
}

public enum OrderStatus
{
    Pending,
    Processing,
    Completed,
    Cancelled
}