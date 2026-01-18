// ======================================================================================
// Mvp24Hours Sample - Auditable Entity Tests
// ======================================================================================

using FluentAssertions;
using Xunit;

namespace Mvp24Hours.Sample.Core.Entities.Tests;

/// <summary>
/// Tests for auditable entity classes.
/// </summary>
public class AuditableEntityTests
{
    [Fact]
    public void Product_ShouldCreate_WithAuditFields()
    {
        var product = new Product("Laptop", 2500.00m, "High-performance laptop");

        product.Id.Should().NotBeEmpty();
        product.Name.Should().Be("Laptop");
        product.Price.Should().Be(2500.00m);
        product.Description.Should().Be("High-performance laptop");
        
        product.CreatedAt.Should().Be(default);
        product.CreatedBy.Should().BeEmpty();
        product.ModifiedAt.Should().BeNull();
        product.ModifiedBy.Should().BeEmpty();
    }

    [Fact]
    public void Product_ShouldUpdateAuditFields()
    {
        var product = new Product("Laptop", 2500.00m);
        var createdAt = DateTime.UtcNow;
        var modifiedAt = DateTime.UtcNow.AddHours(1);

        product.CreatedAt = createdAt;
        product.CreatedBy = "user1";
        product.ModifiedAt = modifiedAt;
        product.ModifiedBy = "user2";

        product.CreatedAt.Should().Be(createdAt);
        product.CreatedBy.Should().Be("user1");
        product.ModifiedAt.Should().Be(modifiedAt);
        product.ModifiedBy.Should().Be("user2");
    }

    [Fact]
    public void Product_ShouldManageStock()
    {
        var product = new Product("Laptop", 2500.00m);

        product.AddStock(10);
        product.RemoveStock(3);

        product.StockQuantity.Should().Be(7);
    }

    [Fact]
    public void Product_ShouldThrow_WhenRemovingMoreThanAvailable()
    {
        var product = new Product("Laptop", 2500.00m);
        product.AddStock(5);

        var act = () => product.RemoveStock(10);

        act.Should().Throw<InvalidOperationException>()
            .WithMessage("*Insufficient stock*");
    }

    [Fact]
    public void BlogPost_ShouldAutoGenerateGuid()
    {
        var post1 = new BlogPost("Post 1", "Content 1");
        var post2 = new BlogPost("Post 2", "Content 2");

        post1.Id.Should().NotBeEmpty();
        post2.Id.Should().NotBeEmpty();
        post1.Id.Should().NotBe(post2.Id);
    }

    [Fact]
    public void BlogPost_ShouldPublish()
    {
        var post = new BlogPost("My Post", "Content here");

        post.IsPublished.Should().BeFalse();
        post.PublishedAt.Should().BeNull();

        post.Publish();

        post.IsPublished.Should().BeTrue();
        post.PublishedAt.Should().NotBeNull();
        post.PublishedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void BlogPost_ShouldUnpublish()
    {
        var post = new BlogPost("My Post", "Content here");
        post.Publish();

        post.Unpublish();

        post.IsPublished.Should().BeFalse();
        post.PublishedAt.Should().BeNull();
    }

    [Fact]
    public void SystemSetting_ShouldUseIntId()
    {
        var setting = new SystemSetting("MaxRetries", "3", "Maximum number of retry attempts");

        setting.Id.Should().Be(0);
        setting.Key.Should().Be("MaxRetries");
        setting.Value.Should().Be("3");
    }

    [Fact]
    public void TransactionRecord_ShouldUseLongId()
    {
        var transaction = new TransactionRecord
        {
            TransactionId = "TXN-001",
            Amount = 1500.00m,
            Currency = "USD",
            Type = TransactionType.Credit
        };

        transaction.Id.Should().Be(0);
        transaction.TransactionId.Should().Be("TXN-001");
        transaction.Amount.Should().Be(1500.00m);
    }
}