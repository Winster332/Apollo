using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Infrastructure.React
{
	public sealed class RedirectJsonViewResult<T>: TypedResult<T>
	{
		// ReSharper disable once UnusedAutoPropertyAccessor.Global
		// ReSharper disable once MemberCanBePrivate.Global
		// Used implicitly by front-end code
		public string To { get; }

		public RedirectJsonViewResult(string to): base("redirect") => To = to;

		public override Task ExecuteResultAsync(ActionContext context)
		{
			ExecuteJsonResult(context, this);

			return Task.CompletedTask;
		}
	}
}