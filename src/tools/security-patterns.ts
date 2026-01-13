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

## User Secrets (Development)

\`\`\`bash
# Initialize
dotnet user-secrets init

# Set secrets
dotnet user-secrets set "Database:Password" "secret123"
dotnet user-secrets set "Jwt:Key" "your-secret-key"

# List secrets
dotnet user-secrets list

# Remove
dotnet user-secrets remove "Database:Password"
\`\`\`

## Azure Key Vault

\`\`\`csharp
// Program.cs
var keyVaultUri = new Uri(builder.Configuration["KeyVault:Uri"]!);

builder.Configuration.AddAzureKeyVault(
    keyVaultUri,
    new DefaultAzureCredential());

// Or with specific credential
builder.Configuration.AddAzureKeyVault(
    keyVaultUri,
    new ClientSecretCredential(
        tenantId,
        clientId,
        clientSecret));
\`\`\`

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
\`\`\`

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

// User secrets / Key Vault (sensitive)
{
  "Database": {
    "Password": "secret123"
  }
}
\`\`\`

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
    builder.Configuration.AddAzureKeyVault(
        new Uri(builder.Configuration["KeyVault:Uri"]!),
        new DefaultAzureCredential());
}
\`\`\`
`,
  };

  return topics[topic] || `Topic "${topic}" not found. Available topics: ${Object.keys(topics).join(", ")}`;
}
