// ======================================================================================
// Mvp24Hours Sample - Soft Deletable Entity Classes
// ======================================================================================

using Mvp24Hours.Core.Contract.Domain.Entity;
using Mvp24Hours.Core.Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace Mvp24Hours.Sample.Core.Entities;

// ======================================================================================
// 4. SOFT DELETABLE ENTITY - Using SoftDeletableEntity<TId>
// ======================================================================================

/// <summary>
/// Example of a soft-deletable entity using SoftDeletableEntity with Guid.
/// Records are logically deleted instead of physically removed.
/// </summary>
public class Document : SoftDeletableEntity<Guid>
{
    [Required]
    [StringLength(200)]
    public string Title { get; private set; } = string.Empty;

    [Required]
    public string Content { get; private set; } = string.Empty;

    [StringLength(50)]
    public string FileType { get; private set; } = string.Empty;

    public long FileSize { get; private set; }

    public string? Tags { get; private set; }

    public DocumentStatus Status { get; private set; } = DocumentStatus.Draft;

    private Document() { }

    public Document(string title, string content, string fileType, long fileSize)
    {
        Id = Guid.NewGuid();
        SetTitle(title);
        SetContent(content);
        FileType = fileType;
        FileSize = fileSize;
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

    public void SetTags(string? tags) => Tags = tags;

    public void Publish()
    {
        if (Status == DocumentStatus.Draft)
        {
            Status = DocumentStatus.Published;
        }
    }

    public void Archive()
    {
        Status = DocumentStatus.Archived;
    }

    public override void SoftDelete(string deletedBy)
    {
        if (Status == DocumentStatus.Published)
        {
            Archive();
        }
        base.SoftDelete(deletedBy);
    }
}

public enum DocumentStatus
{
    Draft,
    Published,
    Archived
}

// ======================================================================================
// CONVENIENCE SOFT DELETABLE ENTITY BASES
// ======================================================================================

/// <summary>
/// Example using SoftDeletableGuidEntity - auto GUID with soft delete + audit.
/// </summary>
public class Comment : SoftDeletableGuidEntity
{
    [Required]
    public string Text { get; private set; } = string.Empty;

    public Guid? ParentId { get; private set; }

    public Guid AuthorId { get; private set; }

    public int LikesCount { get; private set; }

    public bool IsEdited { get; private set; }

    private Comment() : base() { }

    public Comment(string text, Guid authorId, Guid? parentId = null) : base()
    {
        SetText(text);
        AuthorId = authorId;
        ParentId = parentId;
    }

    public void SetText(string text)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(text, nameof(text));
        
        if (!string.IsNullOrEmpty(Text))
        {
            IsEdited = true;
        }
        
        Text = text;
    }

    public void Like() => LikesCount++;
    
    public void Unlike()
    {
        if (LikesCount > 0) LikesCount--;
    }
}

/// <summary>
/// Example using SoftDeletableIntEntity - integer ID with soft delete + audit.
/// </summary>
public class Notification : SoftDeletableIntEntity
{
    [Required]
    [StringLength(200)]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Message { get; set; } = string.Empty;

    public NotificationType Type { get; set; }

    public bool IsRead { get; set; }

    public DateTime? ReadAt { get; set; }

    public string RecipientId { get; set; } = string.Empty;

    public Notification() { }

    public Notification(string title, string message, NotificationType type, string recipientId)
    {
        Title = title;
        Message = message;
        Type = type;
        RecipientId = recipientId;
    }

    public void MarkAsRead()
    {
        if (!IsRead)
        {
            IsRead = true;
            ReadAt = DateTime.UtcNow;
        }
    }
}

public enum NotificationType
{
    Info,
    Warning,
    Error,
    Success
}

/// <summary>
/// Example using SoftDeletableLongEntity - long ID with soft delete + audit.
/// </summary>
public class FileAttachment : SoftDeletableLongEntity
{
    [Required]
    [StringLength(255)]
    public string FileName { get; set; } = string.Empty;

    [Required]
    public string FilePath { get; set; } = string.Empty;

    [StringLength(100)]
    public string ContentType { get; set; } = string.Empty;

    public long Size { get; set; }

    public string? EntityType { get; set; }

    public string? EntityId { get; set; }

    public FileAttachment() { }

    public FileAttachment(string fileName, string filePath, string contentType, long size)
    {
        FileName = fileName;
        FilePath = filePath;
        ContentType = contentType;
        Size = size;
    }

    public void AttachTo(string entityType, string entityId)
    {
        EntityType = entityType;
        EntityId = entityId;
    }
}