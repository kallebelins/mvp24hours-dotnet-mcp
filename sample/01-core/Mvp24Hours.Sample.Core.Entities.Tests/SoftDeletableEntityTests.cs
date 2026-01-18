// ======================================================================================
// Mvp24Hours Sample - Soft Deletable Entity Tests
// ======================================================================================

using FluentAssertions;
using Xunit;

namespace Mvp24Hours.Sample.Core.Entities.Tests;

/// <summary>
/// Tests for soft deletable entity classes.
/// </summary>
public class SoftDeletableEntityTests
{
    [Fact]
    public void Document_ShouldCreate_WithSoftDeleteFields()
    {
        var doc = new Document("Report", "Content here", "pdf", 1024);

        doc.Id.Should().NotBeEmpty();
        doc.Title.Should().Be("Report");
        doc.Content.Should().Be("Content here");
        doc.FileType.Should().Be("pdf");
        doc.FileSize.Should().Be(1024);
        doc.Status.Should().Be(DocumentStatus.Draft);
        
        doc.IsDeleted.Should().BeFalse();
        doc.DeletedAt.Should().BeNull();
        doc.DeletedBy.Should().BeEmpty();
    }

    [Fact]
    public void Document_ShouldSoftDelete()
    {
        var doc = new Document("Report", "Content here", "pdf", 1024);

        doc.SoftDelete("admin");

        doc.IsDeleted.Should().BeTrue();
        doc.DeletedAt.Should().NotBeNull();
        doc.DeletedAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
        doc.DeletedBy.Should().Be("admin");
    }

    [Fact]
    public void Document_ShouldRestore()
    {
        var doc = new Document("Report", "Content here", "pdf", 1024);
        doc.SoftDelete("admin");

        doc.Restore();

        doc.IsDeleted.Should().BeFalse();
        doc.DeletedAt.Should().BeNull();
        doc.DeletedBy.Should().BeEmpty();
    }

    [Fact]
    public void Document_ShouldArchive_BeforeSoftDelete_WhenPublished()
    {
        var doc = new Document("Report", "Content here", "pdf", 1024);
        doc.Publish();
        doc.Status.Should().Be(DocumentStatus.Published);

        doc.SoftDelete("admin");

        doc.Status.Should().Be(DocumentStatus.Archived);
        doc.IsDeleted.Should().BeTrue();
    }

    [Fact]
    public void Document_ShouldTransitionStates()
    {
        var doc = new Document("Report", "Content here", "pdf", 1024);

        doc.Status.Should().Be(DocumentStatus.Draft);

        doc.Publish();
        doc.Status.Should().Be(DocumentStatus.Published);

        doc.Archive();
        doc.Status.Should().Be(DocumentStatus.Archived);
    }

    [Fact]
    public void Comment_ShouldAutoGenerateGuid()
    {
        var authorId = Guid.NewGuid();

        var comment1 = new Comment("First comment", authorId);
        var comment2 = new Comment("Second comment", authorId);

        comment1.Id.Should().NotBeEmpty();
        comment2.Id.Should().NotBeEmpty();
        comment1.Id.Should().NotBe(comment2.Id);
    }

    [Fact]
    public void Comment_ShouldTrackEdits()
    {
        var comment = new Comment("Original text", Guid.NewGuid());

        comment.IsEdited.Should().BeFalse();

        comment.SetText("Updated text");

        comment.IsEdited.Should().BeTrue();
        comment.Text.Should().Be("Updated text");
    }

    [Fact]
    public void Comment_ShouldTrackLikes()
    {
        var comment = new Comment("Nice post!", Guid.NewGuid());

        comment.Like();
        comment.Like();
        comment.Unlike();

        comment.LikesCount.Should().Be(1);
    }

    [Fact]
    public void Comment_Unlike_ShouldNotGoNegative()
    {
        var comment = new Comment("Nice post!", Guid.NewGuid());

        comment.Unlike();
        comment.Unlike();

        comment.LikesCount.Should().Be(0);
    }

    [Fact]
    public void Comment_ShouldSupportParentId()
    {
        var parentComment = new Comment("Parent comment", Guid.NewGuid());
        
        var replyComment = new Comment("Reply to parent", Guid.NewGuid(), parentComment.Id);

        replyComment.ParentId.Should().Be(parentComment.Id);
        parentComment.ParentId.Should().BeNull();
    }

    [Fact]
    public void Notification_ShouldMarkAsRead()
    {
        var notification = new Notification(
            "New Message", 
            "You have a new message", 
            NotificationType.Info, 
            "user123");

        notification.IsRead.Should().BeFalse();
        notification.ReadAt.Should().BeNull();

        notification.MarkAsRead();

        notification.IsRead.Should().BeTrue();
        notification.ReadAt.Should().NotBeNull();
        notification.ReadAt.Should().BeCloseTo(DateTime.UtcNow, TimeSpan.FromSeconds(1));
    }

    [Fact]
    public void Notification_MarkAsRead_ShouldBeIdempotent()
    {
        var notification = new Notification(
            "New Message", 
            "You have a new message", 
            NotificationType.Warning, 
            "user123");
        
        notification.MarkAsRead();
        var firstReadAt = notification.ReadAt;

        System.Threading.Thread.Sleep(10);
        notification.MarkAsRead();

        notification.ReadAt.Should().Be(firstReadAt);
    }

    [Fact]
    public void FileAttachment_ShouldAttachToEntity()
    {
        var file = new FileAttachment("document.pdf", "/files/document.pdf", "application/pdf", 2048);

        file.EntityType.Should().BeNull();
        file.EntityId.Should().BeNull();

        file.AttachTo("Order", "ORD-001");

        file.EntityType.Should().Be("Order");
        file.EntityId.Should().Be("ORD-001");
    }
}