using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Infrastructure.React
{
	public sealed class ModelJsonViewResult<T>: TypedResult<T>
	{
		// ReSharper disable UnusedAutoPropertyAccessor.Global
		// ReSharper disable MemberCanBePrivate.Global
		// Used implicitly by front-end code
		public T Props { get; }

		public string[] AdditionalScripts { get; }
		// ReSharper enable UnusedAutoPropertyAccessor.Global
		// ReSharper enable MemberCanBePrivate.Global

		public ModelJsonViewResult(T props, string[] additionalScripts)
			: base("model")
		{
			Props = props;
			AdditionalScripts = additionalScripts;
		}

		public override Task ExecuteResultAsync(ActionContext context)
		{
			ExecuteJsonResult(context, this);

			return Task.CompletedTask;
		}
	}
}