using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.User;
using Functional.Maybe;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;

namespace Apollo.Web.Infrastructure
{
	public static class HttpContextExtensions
	{
		public static void PreventResponseCaching(this HttpContext context)
		{
			var response = context.Response;
			response.Headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
			response.Headers["Expires"] = "-1";
			response.Headers["Pragma"] = "no-cache";
		}

		public static void SetContentType(this HttpContext context)
		{
			var response = context.Response;
			response.Headers["content-type"] = "text/html;charset=utf-8";
		}

		public static TextWriter GetResponseWriter(this HttpContext context) =>
			new StreamWriter(context.Response.Body, Encoding.UTF8);

		public static async Task SignIn(this HttpContext context, UserId id)
		{
			var claims = new List<Claim> { new(ClaimTypes.Name, id.Value) };

			var claimsIdentity = new ClaimsIdentity(
				claims,
				CookieAuthenticationDefaults.AuthenticationScheme);

			await context.SignInAsync(
				CookieAuthenticationDefaults.AuthenticationScheme,
				new(claimsIdentity));
		}

		public static Maybe<UserId> FindUserId(this HttpContext context) =>
			context
				.ToMaybe()
				.SelectMaybe(ctx => ctx.User.ToMaybe())
				.SelectMaybe(principal =>
					principal.Claims.FirstMaybe(cl => cl.Type == ClaimTypes.Name))
				.Select(claim => new UserId(claim.Value));
	}
}