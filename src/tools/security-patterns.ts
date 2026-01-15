/**
 * Security Patterns Tool
 * 
 * Provides security patterns and best practices for .NET applications.
 */

export const securityPatternsSchema = {
  type: "object" as const,
  properties: {
    topic: {
      type: "string",
      enum: [
        "overview",
        "authentication",
        "authorization",
        "jwt",
        "data-protection",
        "input-validation",
        "secrets-management",
      ],
      description: "Security topic to get documentation for",
    },
  },
  required: [],
};

interface SecurityPatternsArgs {
  topic?: string;
}

export async function securityPatterns(args: unknown): Promise<string> {
  const { topic } = args as SecurityPatternsArgs;

  if (topic && topic !== "overview") {
    return getTopicDoc(topic);
  }

  return getOverview();
}

function getOverview(): string {
  return `# Security Patterns

## Overview

Security best practices for .NET applications.

## OWASP Top 10 Coverage

| Risk | Mitigation |
|------|------------|
| Injection | Input validation, parameterized queries |
| Broken Auth | JWT, Identity, MFA |
| Sensitive Data | Encryption, Data Protection API |
| XXE | Disable DTD processing |
| Broken Access | RBAC, Policy-based auth |
| Security Misconfig | Secure defaults, headers |
| XSS | Output encoding, CSP |
| Insecure Deserialization | Type validation |
| Vulnerable Components | NuGet auditing |
| Insufficient Logging | Structured logging, audit |

## Available Topics

| Topic | Description |
|-------|-------------|
| \`authentication\` | Identity, cookie auth, external providers |
| \`authorization\` | Roles, policies, resource-based |
| \`jwt\` | JWT token implementation |
| \`data-protection\` | Encryption, key management |
| \`input-validation\` | Validation, sanitization |
| \`secrets-management\` | Azure Key Vault, User Secrets |

Use \`mvp24h_security_patterns({ topic: "..." })\` for detailed documentation.
`;
}

function getTopicDoc(topic: string): string {
  const topics: Record<string, string> = {
    authentication: `# Authentication

## ASP.NET Core Identity

\`\`\`csharp
// Program.cs
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    // Password settings
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequireNonAlphanumeric = true;
    options.Password.RequiredLength = 12;

    // Lockout settings
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(15);
    options.Lockout.MaxFailedAccessAttempts = 5;
    options.Lockout.AllowedForNewUsers = true;

    // User settings
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedEmail = true;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
\`\`\`

## Cookie Authentication

\`\`\`csharp
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "MyApp.Auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
        options.Cookie.SameSite = SameSiteMode.Strict;
        options.ExpireTimeSpan = TimeSpan.FromHours(8);
        options.SlidingExpiration = true;
        options.LoginPath = "/login";
        options.LogoutPath = "/logout";
        options.AccessDeniedPath = "/access-denied";
    });
\`\`\`

## External Authentication (OAuth)

\`\`\`csharp
builder.Services.AddAuthentication()
    .AddGoogle(options =>
    {
        options.ClientId = configuration["Authentication:Google:ClientId"]!;
        options.ClientSecret = configuration["Authentication:Google:ClientSecret"]!;
    })
    .AddMicrosoftAccount(options =>
    {
        options.ClientId = configuration["Authentication:Microsoft:ClientId"]!;
        options.ClientSecret = configuration["Authentication:Microsoft:ClientSecret"]!;
    });
\`\`\`

## Login Endpoint

\`\`\`csharp
[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginRequest request)
{
    var user = await _userManager.FindByEmailAsync(request.Email);
    if (user == null)
    {
        // Don't reveal if user exists
        return Unauthorized(new { message = "Invalid credentials" });
    }

    if (await _userManager.IsLockedOutAsync(user))
    {
        return Unauthorized(new { message = "Account locked. Try again later." });
    }

    var result = await _signInManager.CheckPasswordSignInAsync(
        user, request.Password, lockoutOnFailure: true);

    if (!result.Succeeded)
    {
        if (result.RequiresTwoFactor)
        {
            return Ok(new { requiresTwoFactor = true });
        }
        return Unauthorized(new { message = "Invalid credentials" });
    }

    var token = await GenerateJwtTokenAsync(user);
    return Ok(new { token });
}
\`\`\`
`,

    authorization: `# Authorization

## Role-Based Authorization

\`\`\`csharp
// Controller level
[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase { }

// Action level
[HttpDelete("{id}")]
[Authorize(Roles = "Admin,Manager")]
public async Task<IActionResult> Delete(int id) { }

// Multiple roles (AND)
[Authorize(Roles = "Admin")]
[Authorize(Roles = "SuperUser")]
public async Task<IActionResult> SuperAdminOnly() { }
\`\`\`

## Policy-Based Authorization

\`\`\`csharp
// Program.cs
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("RequireAdmin", policy =>
        policy.RequireRole("Admin"));

    options.AddPolicy("RequireAge18", policy =>
        policy.RequireClaim("Age", "18", "19", "20")); // or custom requirement

    options.AddPolicy("CanEditResource", policy =>
        policy.Requirements.Add(new ResourceOwnerRequirement()));

    options.AddPolicy("MinimumAge", policy =>
        policy.Requirements.Add(new MinimumAgeRequirement(18)));
});

// Custom Requirement
public class MinimumAgeRequirement : IAuthorizationRequirement
{
    public int MinimumAge { get; }
    public MinimumAgeRequirement(int minimumAge) => MinimumAge = minimumAge;
}

// Requirement Handler
public class MinimumAgeHandler : AuthorizationHandler<MinimumAgeRequirement>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        MinimumAgeRequirement requirement)
    {
        var dateOfBirthClaim = context.User.FindFirst(c => c.Type == "DateOfBirth");
        if (dateOfBirthClaim == null)
        {
            return Task.CompletedTask;
        }

        var dateOfBirth = DateTime.Parse(dateOfBirthClaim.Value);
        var age = DateTime.Today.Year - dateOfBirth.Year;

        if (age >= requirement.MinimumAge)
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}

// Register handler
builder.Services.AddSingleton<IAuthorizationHandler, MinimumAgeHandler>();
\`\`\`

## Resource-Based Authorization

\`\`\`csharp
public class DocumentAuthorizationHandler 
    : AuthorizationHandler<OperationAuthorizationRequirement, Document>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OperationAuthorizationRequirement requirement,
        Document resource)
    {
        var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (requirement.Name == Operations.Read.Name)
        {
            if (resource.IsPublic || resource.OwnerId == userId)
            {
                context.Succeed(requirement);
            }
        }
        else if (requirement.Name == Operations.Update.Name)
        {
            if (resource.OwnerId == userId)
            {
                context.Succeed(requirement);
            }
        }

        return Task.CompletedTask;
    }
}

// Usage in Controller
[HttpPut("{id}")]
public async Task<IActionResult> Update(int id, DocumentDto dto)
{
    var document = await _repository.GetByIdAsync(id);
    
    var authResult = await _authorizationService.AuthorizeAsync(
        User, document, Operations.Update);

    if (!authResult.Succeeded)
    {
        return Forbid();
    }

    // Update document
}
\`\`\`

## Minimal API Authorization

\`\`\`csharp
app.MapGet("/admin", [Authorize(Roles = "Admin")] () => "Admin only");

app.MapGet("/premium", () => "Premium content")
    .RequireAuthorization("PremiumUser");

app.MapGet("/public", () => "Public content")
    .AllowAnonymous();
\`\`\`
`,

    jwt: `# JWT Authentication

## Configuration

\`\`\`csharp
// appsettings.json
{
  "Jwt": {
    "Key": "your-256-bit-secret-key-here-at-least-32-chars",
    "Issuer": "https://myapp.com",
    "Audience": "https://myapp.com",
    "ExpirationMinutes": 60,
    "RefreshTokenExpirationDays": 7
  }
}
\`\`\`

## Setup

\`\`\`csharp
// Program.cs
var jwtSettings = builder.Configuration.GetSection("Jwt");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(jwtSettings["Key"]!)),
        ClockSkew = TimeSpan.Zero // Remove default 5 min tolerance
    };

    options.Events = new JwtBearerEvents
    {
        OnAuthenticationFailed = context =>
        {
            if (context.Exception is SecurityTokenExpiredException)
            {
                context.Response.Headers.Add("Token-Expired", "true");
            }
            return Task.CompletedTask;
        }
    };
});
\`\`\`

## Token Generation Service

\`\`\`csharp
public interface IJwtService
{
    string GenerateAccessToken(ApplicationUser user, IList<string> roles);
    RefreshToken GenerateRefreshToken();
    ClaimsPrincipal? GetPrincipalFromExpiredToken(string token);
}

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string GenerateAccessToken(ApplicationUser user, IList<string> roles)
    {
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.Name, user.UserName!),
        };

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(
                int.Parse(_configuration["Jwt:ExpirationMinutes"]!)),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public RefreshToken GenerateRefreshToken()
    {
        return new RefreshToken
        {
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            Expires = DateTime.UtcNow.AddDays(
                int.Parse(_configuration["Jwt:RefreshTokenExpirationDays"]!)),
            Created = DateTime.UtcNow
        };
    }

    public ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidAudience = _configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!)),
            ValidateLifetime = false // Don't validate expiration
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(
            token, tokenValidationParameters, out var securityToken);

        if (securityToken is not JwtSecurityToken jwtToken ||
            !jwtToken.Header.Alg.Equals(
                SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
        {
            return null;
        }

        return principal;
    }
}
\`\`\`

## Refresh Token Endpoint

\`\`\`csharp
[HttpPost("refresh")]
public async Task<IActionResult> Refresh([FromBody] RefreshTokenRequest request)
{
    var principal = _jwtService.GetPrincipalFromExpiredToken(request.AccessToken);
    if (principal == null)
    {
        return BadRequest("Invalid access token");
    }

    var userId = principal.FindFirstValue(ClaimTypes.NameIdentifier);
    var user = await _userManager.FindByIdAsync(userId!);

    if (user == null || 
        user.RefreshToken != request.RefreshToken ||
        user.RefreshTokenExpiry <= DateTime.UtcNow)
    {
        return BadRequest("Invalid refresh token");
    }

    var roles = await _userManager.GetRolesAsync(user);
    var newAccessToken = _jwtService.GenerateAccessToken(user, roles);
    var newRefreshToken = _jwtService.GenerateRefreshToken();

    user.RefreshToken = newRefreshToken.Token;
    user.RefreshTokenExpiry = newRefreshToken.Expires;
    await _userManager.UpdateAsync(user);

    return Ok(new
    {
        accessToken = newAccessToken,
        refreshToken = newRefreshToken.Token
    });
}
\`\`\`
`,

    "data-protection": `# Data Protection

## ASP.NET Core Data Protection API

\`\`\`csharp
// Program.cs
builder.Services.AddDataProtection()
    .PersistKeysToFileSystem(new DirectoryInfo(@"/keys"))
    .SetApplicationName("MyApp")
    .SetDefaultKeyLifetime(TimeSpan.FromDays(90));

// For Azure
builder.Services.AddDataProtection()
    .PersistKeysToAzureBlobStorage(blobUri)
    .ProtectKeysWithAzureKeyVault(keyUri, credential);
\`\`\`

## Protecting Sensitive Data

\`\`\`csharp
public class EncryptionService
{
    private readonly IDataProtector _protector;

    public EncryptionService(IDataProtectionProvider provider)
    {
        _protector = provider.CreateProtector("MyApp.SensitiveData");
    }

    public string Encrypt(string plainText)
    {
        return _protector.Protect(plainText);
    }

    public string Decrypt(string cipherText)
    {
        return _protector.Unprotect(cipherText);
    }

    // Time-limited protection
    public string EncryptWithExpiry(string plainText, TimeSpan lifetime)
    {
        var timeLimitedProtector = _protector.ToTimeLimitedDataProtector();
        return timeLimitedProtector.Protect(plainText, lifetime);
    }

    public string? DecryptTimeLimited(string cipherText)
    {
        var timeLimitedProtector = _protector.ToTimeLimitedDataProtector();
        try
        {
            return timeLimitedProtector.Unprotect(cipherText);
        }
        catch (CryptographicException)
        {
            return null; // Token expired or invalid
        }
    }
}
\`\`\`

## Password Hashing

\`\`\`csharp
public class PasswordHasher
{
    public string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
    }

    public bool VerifyPassword(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}

// Using ASP.NET Core Identity
public class CustomPasswordHasher : IPasswordHasher<ApplicationUser>
{
    public string HashPassword(ApplicationUser user, string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password, workFactor: 12);
    }

    public PasswordVerificationResult VerifyHashedPassword(
        ApplicationUser user, string hashedPassword, string providedPassword)
    {
        if (BCrypt.Net.BCrypt.Verify(providedPassword, hashedPassword))
        {
            return PasswordVerificationResult.Success;
        }
        return PasswordVerificationResult.Failed;
    }
}
\`\`\`

## Encrypting Database Fields

\`\`\`csharp
public class EncryptedConverter : ValueConverter<string, string>
{
    public EncryptedConverter(IDataProtector protector)
        : base(
            v => protector.Protect(v),
            v => protector.Unprotect(v))
    {
    }
}

// DbContext configuration
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    var protector = _protectionProvider.CreateProtector("EncryptedFields");
    var converter = new EncryptedConverter(protector);

    modelBuilder.Entity<Customer>()
        .Property(c => c.SocialSecurityNumber)
        .HasConversion(converter);

    modelBuilder.Entity<Customer>()
        .Property(c => c.CreditCardNumber)
        .HasConversion(converter);
}
\`\`\`
`,

    "input-validation": `# Input Validation

## FluentValidation

\`\`\`csharp
public class CreateUserValidator : AbstractValidator<CreateUserRequest>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .EmailAddress().WithMessage("Invalid email format")
            .MaximumLength(255);

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("Password is required")
            .MinimumLength(12).WithMessage("Password must be at least 12 characters")
            .Matches("[A-Z]").WithMessage("Password must contain uppercase")
            .Matches("[a-z]").WithMessage("Password must contain lowercase")
            .Matches("[0-9]").WithMessage("Password must contain number")
            .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain special character");

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100)
            .Matches("^[a-zA-Z\\s'-]+$").WithMessage("Name contains invalid characters");

        RuleFor(x => x.Phone)
            .Matches(@"^\\+?[1-9]\\d{1,14}$").When(x => !string.IsNullOrEmpty(x.Phone))
            .WithMessage("Invalid phone format");
    }
}
\`\`\`

## Sanitization

\`\`\`csharp
using Ganss.Xss;

public class InputSanitizer
{
    private readonly HtmlSanitizer _sanitizer;

    public InputSanitizer()
    {
        _sanitizer = new HtmlSanitizer();
        // Configure allowed tags
        _sanitizer.AllowedTags.Clear();
        _sanitizer.AllowedTags.Add("b");
        _sanitizer.AllowedTags.Add("i");
        _sanitizer.AllowedTags.Add("p");
        _sanitizer.AllowedTags.Add("br");
    }

    public string SanitizeHtml(string html)
    {
        return _sanitizer.Sanitize(html);
    }

    public string SanitizeForSql(string input)
    {
        // Use parameterized queries instead!
        // This is just for logging/display
        return input.Replace("'", "''");
    }

    public string SanitizeFileName(string fileName)
    {
        var invalid = Path.GetInvalidFileNameChars();
        return string.Join("_", fileName.Split(invalid, StringSplitOptions.RemoveEmptyEntries));
    }
}
\`\`\`

## Model Binding Security

\`\`\`csharp
// Prevent over-posting
public class UserUpdateDto
{
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    // Don't include IsAdmin, Role, etc.
}

[HttpPut("{id}")]
public async Task<IActionResult> Update(int id, [FromBody] UserUpdateDto dto)
{
    var user = await _repository.GetByIdAsync(id);
    
    // Only update allowed fields
    user.Name = dto.Name;
    user.Email = dto.Email;
    // Never: user.IsAdmin = dto.IsAdmin;
    
    await _repository.UpdateAsync(user);
    return NoContent();
}

// Or use [Bind] attribute
[HttpPut("{id}")]
public async Task<IActionResult> Update(
    int id,
    [Bind("Name,Email")] User user)
{
    // Only Name and Email are bound
}
\`\`\`

## Request Size Limits

\`\`\`csharp
// Program.cs
builder.Services.Configure<FormOptions>(options =>
{
    options.MultipartBodyLengthLimit = 10 * 1024 * 1024; // 10 MB
});

builder.WebHost.ConfigureKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 10 * 1024 * 1024;
});

// Per-endpoint
[HttpPost]
[RequestSizeLimit(5 * 1024 * 1024)] // 5 MB
[RequestFormLimits(MultipartBodyLengthLimit = 5 * 1024 * 1024)]
public async Task<IActionResult> Upload(IFormFile file) { }
\`\`\`
`,

    "secrets-management": `# Secrets Management

## Overview

Mvp24Hours.Infrastructure provides built-in support for secure secrets management with:
- Azure Key Vault integration
- AWS Secrets Manager integration  
- User Secrets for development
- Environment variables
- Secure configuration loading

**Required Package:**
\`\`\`bash
dotnet add package Mvp24Hours.Infrastructure
# Includes: Azure.Security.KeyVault.Secrets 4.x, AWSSDK.SecretsManager 4.x
\`\`\`

---

## User Secrets (Development)

\`\`\`bash
# Initialize
dotnet user-secrets init

# Set secrets
dotnet user-secrets set "Database:Password" "secret123"
dotnet user-secrets set "Jwt:Key" "your-secret-key"
dotnet user-secrets set "Azure:KeyVaultUri" "https://myvault.vault.azure.net/"
dotnet user-secrets set "AWS:SecretName" "prod/myapp/credentials"

# List secrets
dotnet user-secrets list

# Remove
dotnet user-secrets remove "Database:Password"
\`\`\`

---

## Azure Key Vault

### Basic Setup

\`\`\`csharp
// Required packages (included in Mvp24Hours.Infrastructure)
// Azure.Identity
// Azure.Security.KeyVault.Secrets
// Azure.Extensions.AspNetCore.Configuration.Secrets

// Program.cs
var keyVaultUri = new Uri(builder.Configuration["Azure:KeyVaultUri"]!);

builder.Configuration.AddAzureKeyVault(
    keyVaultUri,
    new DefaultAzureCredential());
\`\`\`

### With Specific Credentials

\`\`\`csharp
// Using Service Principal (Client Credentials)
builder.Configuration.AddAzureKeyVault(
    keyVaultUri,
    new ClientSecretCredential(
        builder.Configuration["Azure:TenantId"],
        builder.Configuration["Azure:ClientId"],
        builder.Configuration["Azure:ClientSecret"]));

// Using Managed Identity (recommended for Azure-hosted apps)
builder.Configuration.AddAzureKeyVault(
    keyVaultUri,
    new ManagedIdentityCredential());

// Using certificate
builder.Configuration.AddAzureKeyVault(
    keyVaultUri,
    new ClientCertificateCredential(
        tenantId,
        clientId,
        certificate));
\`\`\`

### Direct Secret Client Usage

\`\`\`csharp
// Register SecretClient for direct access
builder.Services.AddSingleton(sp =>
{
    var uri = new Uri(builder.Configuration["Azure:KeyVaultUri"]!);
    return new SecretClient(uri, new DefaultAzureCredential());
});

// Usage in service
public class MyService
{
    private readonly SecretClient _secretClient;

    public MyService(SecretClient secretClient)
    {
        _secretClient = secretClient;
    }

    public async Task<string> GetSecretAsync(string secretName)
    {
        var secret = await _secretClient.GetSecretAsync(secretName);
        return secret.Value.Value;
    }

    public async Task SetSecretAsync(string secretName, string value)
    {
        await _secretClient.SetSecretAsync(secretName, value);
    }
}
\`\`\`

### Key Vault with Caching

\`\`\`csharp
// Cache secrets to reduce Key Vault calls
builder.Services.AddSingleton<ISecretProvider>(sp =>
{
    var secretClient = sp.GetRequiredService<SecretClient>();
    var cache = sp.GetRequiredService<IMemoryCache>();
    return new CachedSecretProvider(secretClient, cache, TimeSpan.FromMinutes(5));
});

public class CachedSecretProvider : ISecretProvider
{
    private readonly SecretClient _client;
    private readonly IMemoryCache _cache;
    private readonly TimeSpan _cacheDuration;

    public CachedSecretProvider(SecretClient client, IMemoryCache cache, TimeSpan cacheDuration)
    {
        _client = client;
        _cache = cache;
        _cacheDuration = cacheDuration;
    }

    public async Task<string?> GetSecretAsync(string secretName)
    {
        return await _cache.GetOrCreateAsync(
            $"secret:{secretName}",
            async entry =>
            {
                entry.AbsoluteExpirationRelativeToNow = _cacheDuration;
                var secret = await _client.GetSecretAsync(secretName);
                return secret.Value.Value;
            });
    }
}
\`\`\`

---

## AWS Secrets Manager

### Basic Setup

\`\`\`csharp
// Required packages (included in Mvp24Hours.Infrastructure)
// AWSSDK.SecretsManager

using Amazon.SecretsManager;
using Amazon.SecretsManager.Model;

// Program.cs - Register AWS Secrets Manager
builder.Services.AddSingleton<IAmazonSecretsManager>(sp =>
{
    return new AmazonSecretsManagerClient(Amazon.RegionEndpoint.USEast1);
});
\`\`\`

### Secret Provider Service

\`\`\`csharp
public interface IAwsSecretProvider
{
    Task<string?> GetSecretAsync(string secretName);
    Task<T?> GetSecretAsync<T>(string secretName) where T : class;
}

public class AwsSecretProvider : IAwsSecretProvider
{
    private readonly IAmazonSecretsManager _secretsManager;
    private readonly ILogger<AwsSecretProvider> _logger;

    public AwsSecretProvider(
        IAmazonSecretsManager secretsManager,
        ILogger<AwsSecretProvider> logger)
    {
        _secretsManager = secretsManager;
        _logger = logger;
    }

    public async Task<string?> GetSecretAsync(string secretName)
    {
        try
        {
            var request = new GetSecretValueRequest
            {
                SecretId = secretName,
                VersionStage = "AWSCURRENT"
            };

            var response = await _secretsManager.GetSecretValueAsync(request);

            // Secret can be string or binary
            if (response.SecretString != null)
            {
                return response.SecretString;
            }

            // Handle binary secret
            using var reader = new StreamReader(response.SecretBinary);
            return await reader.ReadToEndAsync();
        }
        catch (ResourceNotFoundException)
        {
            _logger.LogWarning("Secret {SecretName} not found", secretName);
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving secret {SecretName}", secretName);
            throw;
        }
    }

    public async Task<T?> GetSecretAsync<T>(string secretName) where T : class
    {
        var secretJson = await GetSecretAsync(secretName);
        if (string.IsNullOrEmpty(secretJson))
            return null;

        return JsonSerializer.Deserialize<T>(secretJson);
    }
}

// Registration
builder.Services.AddSingleton<IAwsSecretProvider, AwsSecretProvider>();
\`\`\`

### AWS Configuration Provider

\`\`\`csharp
// Load secrets into configuration at startup
public static class AwsSecretsExtensions
{
    public static IConfigurationBuilder AddAwsSecrets(
        this IConfigurationBuilder builder,
        string secretName,
        Amazon.RegionEndpoint region)
    {
        var client = new AmazonSecretsManagerClient(region);
        
        var request = new GetSecretValueRequest
        {
            SecretId = secretName
        };

        try
        {
            var response = client.GetSecretValueAsync(request).Result;
            var secrets = JsonSerializer.Deserialize<Dictionary<string, string>>(
                response.SecretString);

            if (secrets != null)
            {
                builder.AddInMemoryCollection(secrets!);
            }
        }
        catch (Exception ex)
        {
            // Log and continue - secrets may not be required in dev
            Console.WriteLine($"AWS Secrets Manager error: {ex.Message}");
        }

        return builder;
    }
}

// Usage in Program.cs
builder.Configuration.AddAwsSecrets(
    "prod/myapp/credentials",
    Amazon.RegionEndpoint.USEast1);
\`\`\`

### AWS with IAM Role (EC2/ECS/Lambda)

\`\`\`csharp
// When running on AWS, use IAM role credentials (no explicit credentials needed)
builder.Services.AddSingleton<IAmazonSecretsManager>(sp =>
{
    // Automatically uses IAM role attached to EC2/ECS/Lambda
    return new AmazonSecretsManagerClient();
});

// For local development, configure AWS credentials
// ~/.aws/credentials or environment variables
// AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION
\`\`\`

---

## Environment Variables

\`\`\`csharp
// appsettings.json - reference environment variables
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=mydb;User Id=sa;Password=\${DB_PASSWORD}"
  }
}

// Or use environment variable directly
var password = Environment.GetEnvironmentVariable("DB_PASSWORD");

// Docker/Kubernetes
// docker run -e DB_PASSWORD=secret myapp

// Kubernetes Secret
// kubectl create secret generic myapp-secrets --from-literal=DB_PASSWORD=secret
\`\`\`

---

## Options Pattern with Secrets

\`\`\`csharp
public class DatabaseOptions
{
    public string Server { get; set; } = string.Empty;
    public string Database { get; set; } = string.Empty;
    public string UserId { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;

    public string ConnectionString =>
        $"Server={Server};Database={Database};User Id={UserId};Password={Password}";
}

// Program.cs
builder.Services.Configure<DatabaseOptions>(
    builder.Configuration.GetSection("Database"));

// appsettings.json (non-sensitive)
{
  "Database": {
    "Server": "localhost",
    "Database": "mydb",
    "UserId": "appuser"
  }
}

// User secrets / Key Vault / AWS Secrets Manager (sensitive)
{
  "Database": {
    "Password": "secret123"
  }
}
\`\`\`

---

## Secret Rotation

\`\`\`csharp
public class RotatingSecretService
{
    private readonly IConfiguration _configuration;
    private readonly IOptionsMonitor<JwtOptions> _jwtOptions;

    public RotatingSecretService(
        IConfiguration configuration,
        IOptionsMonitor<JwtOptions> jwtOptions)
    {
        _configuration = configuration;
        _jwtOptions = jwtOptions;

        // React to configuration changes
        _jwtOptions.OnChange(options =>
        {
            // Handle key rotation
            RefreshTokenValidationKeys();
        });
    }

    public void RefreshTokenValidationKeys()
    {
        // Support multiple keys during rotation
        var currentKey = _jwtOptions.CurrentValue.Key;
        var previousKey = _jwtOptions.CurrentValue.PreviousKey;

        // Validate tokens with either key
    }
}
\`\`\`

---

## Secure Configuration Loading

\`\`\`csharp
var builder = WebApplication.CreateBuilder(args);

// Order matters - later sources override earlier
builder.Configuration
    .AddJsonFile("appsettings.json", optional: false)
    .AddJsonFile($"appsettings.{builder.Environment.EnvironmentName}.json", optional: true)
    .AddEnvironmentVariables()
    .AddUserSecrets<Program>(optional: true); // Dev only

if (builder.Environment.IsProduction())
{
    // Choose your cloud provider
    var cloudProvider = builder.Configuration["CloudProvider"];

    if (cloudProvider == "Azure")
    {
        builder.Configuration.AddAzureKeyVault(
            new Uri(builder.Configuration["Azure:KeyVaultUri"]!),
            new DefaultAzureCredential());
    }
    else if (cloudProvider == "AWS")
    {
        builder.Configuration.AddAwsSecrets(
            builder.Configuration["AWS:SecretName"]!,
            Amazon.RegionEndpoint.GetBySystemName(
                builder.Configuration["AWS:Region"] ?? "us-east-1"));
    }
}
\`\`\`

---

## Quick Reference

| Provider | Package | Best For |
|----------|---------|----------|
| User Secrets | Microsoft.Extensions.Configuration.UserSecrets | Development |
| Azure Key Vault | Azure.Security.KeyVault.Secrets | Azure-hosted apps |
| AWS Secrets Manager | AWSSDK.SecretsManager | AWS-hosted apps |
| Environment Variables | Built-in | Containers, CI/CD |

## Related Topics

- Use \`mvp24h_infrastructure_guide({ topic: "infrastructure-base" })\` for HTTP resilience
- Use \`mvp24h_containerization_patterns({ topic: "configuration" })\` for Kubernetes secrets
- Use \`mvp24h_security_patterns({ topic: "data-protection" })\` for encryption
`,
  };

  return topics[topic] || `Topic "${topic}" not found. Available topics: ${Object.keys(topics).join(", ")}`;
}
