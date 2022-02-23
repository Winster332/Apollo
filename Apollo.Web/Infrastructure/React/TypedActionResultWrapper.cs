using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Infrastructure.React
{
	public sealed class TypedActionResultWrapper<T>: TypedResult<T>
	{
		private readonly ActionResult _result;

		public TypedActionResultWrapper(ActionResult result, string type): base(type) =>
			_result = result;

		public override Task ExecuteResultAsync(ActionContext context) =>
			_result.ExecuteResultAsync(context);
	}
}