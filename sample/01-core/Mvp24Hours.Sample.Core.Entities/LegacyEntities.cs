// ======================================================================================
// Mvp24Hours Sample - Legacy Entity Classes
// ======================================================================================
// This sample demonstrates the legacy entity style using EntityBase and EntityBaseLog
// from the Mvp24Hours.Core.Entities namespace (simple style).
// ======================================================================================

using Mvp24Hours.Core.Contract.Domain.Entity;
using System.ComponentModel.DataAnnotations;
using LegacyEntityBase = Mvp24Hours.Core.Entities.EntityBase<System.Guid>;
using LegacyEntityBaseLog = Mvp24Hours.Core.Entities.EntityBaseLog<System.Guid, string>;

namespace Mvp24Hours.Sample.Core.Entities;

// ======================================================================================
// LEGACY STYLE - Using EntityBase from Mvp24Hours.Core.Entities
// ======================================================================================

/// <summary>
/// Example using the legacy EntityBase from Mvp24Hours.Core.Entities.
/// Simpler but without equality comparison features.
/// </summary>
public class SimplePerson : LegacyEntityBase
{
    [Required]
    [StringLength(100)]
    public string FullName { get; set; } = string.Empty;

    [StringLength(11)]
    public string? Cpf { get; set; }

    public DateTime? BirthDate { get; set; }

    public SimplePerson() { }

    public SimplePerson(string fullName, string? cpf = null)
    {
        Id = Guid.NewGuid();
        FullName = fullName;
        Cpf = cpf;
    }
}

// ======================================================================================
// LEGACY STYLE WITH LOG - Using EntityBaseLog
// ======================================================================================

/// <summary>
/// Example using the legacy EntityBaseLog from Mvp24Hours.Core.Entities.
/// Includes audit fields with different naming convention (Created vs CreatedAt).
/// </summary>
public class Employee : LegacyEntityBaseLog
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [StringLength(255)]
    public string Email { get; set; } = string.Empty;

    [StringLength(50)]
    public string? Department { get; set; }

    [StringLength(50)]
    public string? Position { get; set; }

    public decimal? Salary { get; set; }

    public DateTime HireDate { get; set; }

    public DateTime? TerminationDate { get; set; }

    public bool IsActive { get; set; } = true;

    public Employee() { }

    public Employee(string name, string email, string? department = null)
    {
        Id = Guid.NewGuid();
        Name = name;
        Email = email;
        Department = department;
        HireDate = DateTime.UtcNow;
        Created = DateTime.UtcNow;
    }

    public void Terminate(string terminatedBy)
    {
        IsActive = false;
        TerminationDate = DateTime.UtcNow;
        Removed = DateTime.UtcNow;
        RemovedBy = terminatedBy;
    }

    public void Reactivate()
    {
        IsActive = true;
        TerminationDate = null;
        Removed = null;
        RemovedBy = null;
    }
}

// ======================================================================================
// COMPARISON: IEntityLog vs IAuditableEntity + ISoftDeletable
// ======================================================================================

/// <summary>
/// Example of a custom entity implementing IEntityLog directly (string FK for user).
/// Note: Using string instead of int for simpler implementation with nullable types.
/// </summary>
public class InventoryItem : Mvp24Hours.Core.Entities.EntityBase<int>, IEntityLog<string>
{
    [Required]
    [StringLength(50)]
    public string Sku { get; set; } = string.Empty;

    [Required]
    [StringLength(200)]
    public string Name { get; set; } = string.Empty;

    public int Quantity { get; set; }

    [StringLength(50)]
    public string? Location { get; set; }

    // IEntityLog<string> implementation
    public DateTime Created { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime? Modified { get; set; }
    public string? ModifiedBy { get; set; }
    public DateTime? Removed { get; set; }
    public string? RemovedBy { get; set; }

    public InventoryItem() { }

    public InventoryItem(string sku, string name, int quantity)
    {
        Sku = sku;
        Name = name;
        Quantity = quantity;
        Created = DateTime.UtcNow;
    }

    public void UpdateQuantity(int newQuantity, string userId)
    {
        Quantity = newQuantity;
        Modified = DateTime.UtcNow;
        ModifiedBy = userId;
    }

    public void Remove(string userId)
    {
        Removed = DateTime.UtcNow;
        RemovedBy = userId;
    }

    public bool IsRemoved => Removed.HasValue;
}

/// <summary>
/// Example implementing IEntityDateLog (date-only, without user tracking).
/// </summary>
public class SystemLog : Mvp24Hours.Core.Entities.EntityBase<long>, IEntityDateLog
{
    public string Level { get; set; } = "INFO";
    public string Message { get; set; } = string.Empty;
    public string? StackTrace { get; set; }
    public string? Source { get; set; }

    // IEntityDateLog implementation
    public DateTime Created { get; set; }
    public DateTime? Modified { get; set; }
    public DateTime? Removed { get; set; }

    public SystemLog() { }

    public SystemLog(string level, string message, string? source = null)
    {
        Level = level;
        Message = message;
        Source = source;
        Created = DateTime.UtcNow;
    }
}