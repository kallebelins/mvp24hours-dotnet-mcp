// ======================================================================================
// Mvp24Hours Sample - Entity Base Tests
// ======================================================================================

using FluentAssertions;
using Xunit;

namespace Mvp24Hours.Sample.Core.Entities.Tests;

/// <summary>
/// Tests for basic entity classes using EntityBase.
/// </summary>
public class BasicEntityTests
{
    [Fact]
    public void Customer_ShouldCreate_WithValidData()
    {
        var customer = new Customer("John Doe", "john@example.com", "+5511999999999");

        customer.Id.Should().NotBeEmpty();
        customer.Name.Should().Be("John Doe");
        customer.Email.Should().Be("john@example.com");
        customer.Phone.Should().Be("+5511999999999");
    }

    [Fact]
    public void Customer_ShouldThrow_WhenNameIsEmpty()
    {
        var act = () => new Customer("", "john@example.com");

        act.Should().Throw<ArgumentException>();
    }

    [Fact]
    public void Customer_ShouldUpdateName()
    {
        var customer = new Customer("John Doe", "john@example.com");

        customer.SetName("Jane Doe");

        customer.Name.Should().Be("Jane Doe");
    }

    [Fact]
    public void Order_ShouldAutoGenerateGuid()
    {
        var order1 = new Order("ORD-001", 100.00m);
        var order2 = new Order("ORD-002", 200.00m);

        order1.Id.Should().NotBeEmpty();
        order2.Id.Should().NotBeEmpty();
        order1.Id.Should().NotBe(order2.Id);
    }

    [Fact]
    public void Order_ShouldChangeStatus()
    {
        var order = new Order("ORD-001", 100.00m);

        order.Status.Should().Be(OrderStatus.Pending);

        order.Complete();
        order.Status.Should().Be(OrderStatus.Completed);
    }

    [Fact]
    public void Category_ShouldCreateWithIntId()
    {
        var category = new Category("Electronics", "Electronic devices and accessories");

        category.Id.Should().Be(0);
        category.Name.Should().Be("Electronics");
        category.Description.Should().Be("Electronic devices and accessories");
    }

    [Fact]
    public void AuditLog_ShouldCreateWithLongId()
    {
        var log = new AuditLog
        {
            Action = "CREATE",
            EntityType = "Customer",
            EntityId = Guid.NewGuid().ToString(),
            UserId = "user123"
        };

        log.Id.Should().Be(0);
        log.Action.Should().Be("CREATE");
        log.Timestamp.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }
}

/// <summary>
/// Tests for entity equality based on identity.
/// </summary>
public class EntityEqualityTests
{
    [Fact]
    public void Entities_WithSameId_ShouldBeEqual()
    {
        var id = Guid.NewGuid();
        var customer1 = new Customer("John", "john@example.com") { Id = id };
        var customer2 = new Customer("Jane", "jane@example.com") { Id = id };

        customer1.Should().Be(customer2);
    }

    [Fact]
    public void Entities_WithDifferentIds_ShouldNotBeEqual()
    {
        var customer1 = new Customer("John", "john@example.com");
        var customer2 = new Customer("John", "john@example.com");

        customer1.Should().NotBe(customer2);
    }

    [Fact]
    public void TransientEntities_ShouldNotBeEqual()
    {
        var customer1 = new Customer("John", "john@example.com") { Id = default };
        var customer2 = new Customer("John", "john@example.com") { Id = default };

        customer1.Should().NotBe(customer2);
    }

    [Fact]
    public void Entity_IsTransient_WhenIdIsDefault()
    {
        var customer = new Customer("John", "john@example.com");
        var normalCustomer = customer.IsTransient();
        
        customer.Id = default;
        var transientCustomer = customer.IsTransient();

        normalCustomer.Should().BeFalse();
        transientCustomer.Should().BeTrue();
    }

    [Fact]
    public void Entity_HashCode_ShouldBeConsistent()
    {
        var customer = new Customer("John", "john@example.com");
        var hash1 = customer.GetHashCode();

        customer.SetName("Jane");
        var hash2 = customer.GetHashCode();

        hash1.Should().Be(hash2);
    }
}