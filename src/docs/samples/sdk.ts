// The code samples of the .NET SDK page, shared by every language

export const install = `dotnet add package ErtisAuth.Sdk.AspNetCore`

export const quickSettings = `{
	"ErtisAuth": {
		"BaseUrl": "https://auth.example.com",
		"MembershipId": "66f1c0d2a4b5c6d7e8f90123"
	}
}`

export const setup = `using ErtisAuth.Sdk.AspNetCore.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddErtisAuth();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();`

export const quickController = `using ErtisAuth.Core.Models.Roles;
using ErtisAuth.Extensions.Authorization.Attributes;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("orders")]
[Authorized]
[RbacResource("orders")]
public class OrdersController : ControllerBase
{
	// Requires "orders.read"
	[HttpGet]
	[RbacAction(Rbac.CrudActions.Read)]
	public IActionResult List() => this.Ok();
}`

export const kubernetes = `env:
  - name: ErtisAuth__BaseUrl
    value: https://auth.example.com
  - name: ErtisAuth__MembershipId
    value: 66f1c0d2a4b5c6d7e8f90123`

export const settingsInCode = `builder.Services.AddErtisAuth(options =>
{
	options.BaseUrl = "https://auth.example.com";
	options.MembershipId = "66f1c0d2a4b5c6d7e8f90123";
});`

export const controller = `using ErtisAuth.Core.Models.Roles;
using ErtisAuth.Extensions.Authorization.Attributes;
using ErtisAuth.Sdk.AspNetCore.Extensions;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("orders")]
[Authorized]
[RbacResource("orders")]
public class OrdersController : ControllerBase
{
	// Requires "orders.read"
	[HttpGet]
	[RbacAction(Rbac.CrudActions.Read)]
	public IActionResult List() { … }

	// Requires "orders.read.{id}" (granted by "orders.read" too)
	[HttpGet("{id}")]
	[RbacAction(Rbac.CrudActions.Read)]
	[RbacObject("{id}")]
	public IActionResult Get(string id) { … }

	// A custom action: requires "orders.approve.{id}"
	[HttpPost("{id}/approve")]
	[RbacAction("approve")]
	[RbacObject("{id}")]
	public IActionResult Approve(string id)
	{
		var utilizer = this.GetUtilizer();
		// utilizer.Id, utilizer.Username, utilizer.Role, utilizer.Type (User or Application)…
		…
	}

	// Another resource: requires "invoices.read.{id}"
	[HttpGet("{id}/invoice")]
	[RbacResource("invoices")]
	[RbacAction(Rbac.CrudActions.Read)]
	[RbacObject("{id}")]
	public IActionResult Invoice(string id) { … }

	// Public
	[HttpGet("statuses")]
	[Unauthorized]
	public IActionResult Statuses() { … }
}`

export const selfAuthorized = `using ErtisAuth.Core.Models.Identity;
using ErtisAuth.Extensions.Authorization.Attributes;
using ErtisAuth.Sdk.AspNetCore.Extensions;
using ErtisAuth.Sdk.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("documents")]
public class DocumentsController(IDocumentStore documents, IRoleService roleService) : ControllerBase
{
	// Requires "documents-{category}.read.{id}", where the category is a field of the document
	[HttpGet("{id}")]
	[SelfAuthorized]
	public async Task<IActionResult> Get(string id, CancellationToken cancellationToken)
	{
		var document = await documents.GetAsync(id, cancellationToken);
		if (document == null)
		{
			return this.NotFound();
		}

		var utilizer = this.GetUtilizer()!.Value;
		TokenBase token = utilizer.TokenType == SupportedTokenTypes.Basic ? new BasicToken(utilizer.Token!) : BearerToken.CreateTemp(utilizer.Token!);
		if (!await roleService.CheckPermissionAsync($"documents-{document.Category}.read.{id}", token, cancellationToken))
		{
			return this.StatusCode(StatusCodes.Status403Forbidden);
		}

		return this.Ok(document);
	}
}`

export const minimalApi = `app.MapGet("/orders", () => Results.Ok())
	.WithMetadata(new AuthorizedAttribute(), new RbacResourceAttribute("orders"), new RbacActionAttribute(Rbac.CrudActions.Read));

app.MapGet("/profile", () => Results.Ok())
	.WithMetadata(new SelfAuthorizedAttribute());`

export const placeholder = `[HttpGet("reports")]
[RbacAction(Rbac.CrudActions.Read)]
[RbacObject("{query::reportId}")]
public IActionResult Report([FromQuery] string reportId) { … }`

export const clientRegistration = `using ErtisAuth.Sdk.Extensions;

builder.Services.AddErtisAuthServices();`

export const signIn = `using System.Net;
using ErtisAuth.Extensions.Authorization.Attributes;
using ErtisAuth.Sdk.Extensions;
using Microsoft.AspNetCore.Mvc;
using IErtisAuthAuthenticationService = ErtisAuth.Sdk.Services.Interfaces.IAuthenticationService;

[ApiController]
[Route("account")]
public class AccountController(IErtisAuthAuthenticationService authenticationService) : ControllerBase
{
	[HttpPost("sign-in")]
	[Unauthorized]
	public async Task<IActionResult> SignIn(SignInRequest request, CancellationToken cancellationToken)
	{
		var response = await authenticationService.GetTokenAsync(
			request.Username,
			request.Password,
			ipAddress: this.HttpContext.Connection.RemoteIpAddress?.ToString(),
			userAgent: this.Request.Headers.UserAgent,
			cancellationToken: cancellationToken);

		if (response.IsSuccess)
		{
			return this.Ok(response.Data);
		}

		if (response.IsServiceUnavailable())
		{
			return this.StatusCode((int)HttpStatusCode.ServiceUnavailable);
		}

		// e.g. 401 InvalidCredentials, as ErtisAuth answered it
		return new ContentResult { StatusCode = (int?)response.StatusCode, Content = response.Json, ContentType = "application/json" };
	}
}`

export const refresh = `var response = await authenticationService.RefreshTokenAsync(refreshToken, cancellationToken);
if (response.IsSuccess)
{
	var tokens = response.Data!; // tokens.AccessToken, tokens.RefreshToken…
}`

export const revoke = `await authenticationService.RevokeTokenAsync(accessToken, logoutFromAllDevices: false, cancellationToken);`

export const createUser = `public class Employee : UserWithPassword
{
	[JsonPropertyName("department")]
	public string? Department { get; set; }
}

var response = await userService.CreateAsync(new Employee
{
	MembershipId = membershipId, // the MembershipId of the SDK settings
	Username = "ada",
	EmailAddress = "ada@example.com",
	FirstName = "Ada",
	LastName = "Lovelace",
	Password = password,
	Role = "support",
	UserType = "employee",
	Department = "Engineering"
}, appToken, cancellationToken);`

export const resetPassword = `await passwordService.ResetPasswordAsync(emailAddress, "https://app.example.com/reset-password", appToken, cancellationToken);

// On the reset page, with the token of the link
await passwordService.SetPasswordAsync(emailAddress, newPassword, resetToken, appToken, cancellationToken);`

export const queryUsers = `var users = await userService.QueryAsync(appToken, """{ "where": { "is_active": false } }""", limit: 50, sorting: null);`

export const workerProgram = `using ErtisAuth.Sdk.Extensions;

var builder = Host.CreateApplicationBuilder(args);

builder.Services.AddErtisAuthServices();
builder.Services.AddHostedService<InactiveUsersReport>();

builder.Build().Run();`

export const worker = `using ErtisAuth.Core.Models.Identity;
using ErtisAuth.Sdk.Services.Interfaces;

public class InactiveUsersReport(IUserService userService, IConfiguration configuration, ILogger<InactiveUsersReport> logger) : BackgroundService
{
	protected override async Task ExecuteAsync(CancellationToken stoppingToken)
	{
		var appToken = new BasicToken($"{configuration["Report:ApplicationId"]}:{configuration["Report:ApplicationSecret"]}");
		var response = await userService.QueryAsync(appToken, """{ "where": { "is_active": false } }""", withCount: true, sorting: null, cancellationToken: stoppingToken);
		if (response.IsSuccess)
		{
			logger.LogInformation("{Count} inactive users", response.Data!.Count);
		}
	}
}`

export const customHandler = `using System.Text.Encodings.Web;
using ErtisAuth.Core.Models.Identity;
using ErtisAuth.Sdk.AspNetCore.Middleware;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

public class AuditedAuthenticationHandler(
	IAuthorizationHandler<BasicToken> basicAuthorizationHandler,
	IAuthorizationHandler<BearerToken> bearerAuthorizationHandler,
	IOptionsMonitor<AuthenticationSchemeOptions> options,
	ILoggerFactory logger,
	UrlEncoder encoder)
	: ErtisAuthAuthenticationHandler(basicAuthorizationHandler, bearerAuthorizationHandler, options, logger, encoder)
{
	protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
	{
		var result = await base.HandleAuthenticateAsync();
		if (result.Failure != null)
		{
			this.Logger.LogWarning("Request to {Path} was not authenticated: {Reason}", this.Request.Path, result.Failure.Message);
		}

		return result;
	}
}`

export const customHandlerRegistration = `builder.Services.AddErtisAuth<AuditedAuthenticationHandler>();`

export const testHandler = `using System.Security.Claims;
using System.Text.Encodings.Web;
using ErtisAuth.Core.Models.Identity;
using ErtisAuth.Extensions.Authorization.Extensions;
using ErtisAuth.Sdk.AspNetCore.Middleware;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;

public class TestAuthenticationHandler(
	IAuthorizationHandler<BasicToken> basicAuthorizationHandler,
	IAuthorizationHandler<BearerToken> bearerAuthorizationHandler,
	IOptionsMonitor<AuthenticationSchemeOptions> options,
	ILoggerFactory logger,
	UrlEncoder encoder)
	: ErtisAuthAuthenticationHandler(basicAuthorizationHandler, bearerAuthorizationHandler, options, logger, encoder)
{
	protected override Task<AuthenticateResult> HandleAuthenticateAsync()
	{
		var utilizer = new Utilizer
		{
			Id = "test-user",
			Username = "test",
			Role = "admin",
			Type = Utilizer.UtilizerType.User,
			MembershipId = "test-membership",
			Token = "test-token",
			TokenType = SupportedTokenTypes.Bearer
		};

		var principal = new ClaimsPrincipal(utilizer.ToClaimsIdentity());
		return Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(principal, this.Scheme.Name)));
	}
}`

export const testFactory = `using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;

public class OrdersApiTests(WebApplicationFactory<Program> factory) : IClassFixture<WebApplicationFactory<Program>>
{
	private HttpClient CreateClient() => factory
		.WithWebHostBuilder(builder => builder.ConfigureTestServices(services =>
			services.AddTransient<ErtisAuthAuthenticationHandler, TestAuthenticationHandler>()))
		.CreateClient();
}`
