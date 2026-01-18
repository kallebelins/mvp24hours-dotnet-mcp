// ======================================================================================
// Mvp24Hours Sample - Legacy Entity Tests
// ======================================================================================

using FluentAssertions;
using Xunit;

namespace Mvp24Hours.Sample.Core.Entities.Tests;

/// <summary>
/// Tests for legacy entity classes using EntityBase and EntityBaseLog.
/// </summary>
public class LegacyEntityTests
{
    [Fact]
    public void SimplePerson_ShouldCreate()
    {
        var person = new SimplePerson("John Doe", "12345678901");

        person.Id.Should().NotBeEmpty();
        person.FullName.Should().Be("John Doe");
        person.Cpf.Should().Be("12345678901");
    }

    [Fact]
    public void Employee_ShouldCreate_WithLogFields()
    {
        var employee = new Employee("John Doe", "john@company.com", "IT");

        employee.Id.Should().NotBeEmpty();
        employee.Name.Should().Be("John Doe");
        employee.Email.Should().Be("john@company.com");
        employee.Department.Should().Be("IT");
        employee.IsActive.Should().BeTrue();
        employee.Created.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Employee_ShouldTerminate()
    {
        var employee = new Employee("John Doe", "john@company.com");

        employee.Terminate("admin");

        employee.IsActive.Should().BeFalse();
        employee.TerminationDate.Should().NotBeNull();
        employee.Removed.Should().NotBeNull();
        employee.RemovedBy.Should().Be("admin");
    }

    [Fact]
    public void Employee_ShouldReactivate()
    {
        var employee = new Employee("John Doe", "john@company.com");
        employee.Terminate("admin");

        employee.Reactivate();

        employee.IsActive.Should().BeTrue();
        employee.TerminationDate.Should().BeNull();
        employee.Removed.Should().BeNull();
        employee.RemovedBy.Should().BeNull();
    }

    [Fact]
    public void InventoryItem_ShouldUpdateQuantity()
    {
        var item = new InventoryItem("SKU-001", "Widget", 100);

        item.UpdateQuantity(150, userId: "user1");

        item.Quantity.Should().Be(150);
        item.Modified.Should().NotBeNull();
        item.ModifiedBy.Should().Be("user1");
    }

    [Fact]
    public void InventoryItem_ShouldRemove()
    {
        var item = new InventoryItem("SKU-001", "Widget", 100);

        item.IsRemoved.Should().BeFalse();

        item.Remove(userId: "user1");

        item.IsRemoved.Should().BeTrue();
        item.Removed.Should().NotBeNull();
        item.RemovedBy.Should().Be("user1");
    }

    [Fact]
    public void SystemLog_ShouldCreate_WithDateOnlyLog()
    {
        var log = new SystemLog("ERROR", "Something went wrong", "MyApp");

        log.Level.Should().Be("ERROR");
        log.Message.Should().Be("Something went wrong");
        log.Source.Should().Be("MyApp");
        log.Created.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        
        log.Modified.Should().BeNull();
        log.Removed.Should().BeNull();
    }
}

/// <summary>
/// Tests comparing legacy IEntityLog with modern IAuditableEntity + ISoftDeletable.
/// </summary>
public class LegacyVsModernComparisonTests
{
    [Fact]
    public void LegacyLog_HasDifferentPropertyNames()
    {
        var employee = new Employee("John", "john@example.com");
        var document = new Document("Doc", "Content", "pdf", 1024);

        employee.Created.Should().NotBe(default);
        document.CreatedAt.Should().Be(default);

        employee.Removed.Should().BeNull();
        document.IsDeleted.Should().BeFalse();
    }

    [Fact]
    public void LegacySoftDelete_UsesRemovedField()
    {
        var employee = new Employee("John", "john@example.com");
        employee.Terminate("admin");

        var isDeleted = employee.Removed.HasValue;
        isDeleted.Should().BeTrue();
    }

    [Fact]
    public void ModernSoftDelete_UsesIsDeletedFlag()
    {
        var document = new Document("Doc", "Content", "pdf", 1024);
        document.SoftDelete("admin");

        document.IsDeleted.Should().BeTrue();
    }

    [Fact]
    public void BothStyles_UseStringForUserTracking()
    {
        var legacyItem = new InventoryItem("SKU", "Item", 10);
        legacyItem.CreatedBy = "user-123";

        var modernProduct = new Product("Product", 100m);
        modernProduct.CreatedBy = "user-123";

        legacyItem.CreatedBy.Should().BeOfType<string>();
        modernProduct.CreatedBy.Should().BeOfType<string>();
    }
}