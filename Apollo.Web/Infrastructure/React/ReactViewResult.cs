using System.IO;
using System.Text.Encodings.Web;
using System.Threading.Tasks;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.Configuration;
using Apollo.Domain.SharedKernel;
using DeviceDetectorNET;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using React.AspNet;

namespace Apollo.Web.Infrastructure.React
{
	/// <summary>
	/// Представление, генерирующее HTML для страницы, запускающей React-приложение.
	/// </summary>
	/// <remarks><see cref="T:System.Web.Mvc.IViewDataContainer" /> имплементирован для создания <see cref="T:System.Web.Mvc.HtmlHelper" />.</remarks>
	internal sealed class ReactViewResult<T>: TypedResult<T>
	{
		private readonly T _model;
		private readonly bool _clientOnly;
		private readonly string _appName;
		private readonly string[] _additionalScripts;
		private readonly UniverseState _universeState;
		private readonly string _userAgent;
		private readonly Maybe<UserView> _userView;
		private readonly QuantitativeCounter[] _counters;

		public ReactViewResult(
			T model,
			bool clientOnly,
			string[] additionalScripts,
			UniverseState universeState,
			string userAgent,
			Maybe<UserView> userView,
			QuantitativeCounter[] counters)
			: base("never")
		{
			_model = model;
			_clientOnly = clientOnly;
			_universeState = universeState;
			_additionalScripts = additionalScripts;
			_appName = AppNameHelpers.GetAppNameForType(typeof(T));
			_userAgent = userAgent;
			_userView = userView;
			_counters = counters;
		}

		public override async Task ExecuteResultAsync(ActionContext context)
		{
			var httpContext = context.HttpContext;
			httpContext.PreventResponseCaching();
			httpContext.SetContentType();
			await using var writer = httpContext.GetResponseWriter();
			await Render(_model, _clientOnly, writer);
		}

		private async Task Render(T props, bool clientOnly, TextWriter writer)
		{
			await writer.WriteAsync("<!DOCTYPE html>\r\n");

			var serverProps = new ServerProps(
				_appName,
				props,
				_universeState,
				SystemTime.Now,
				_additionalScripts,
				true,
				new DeviceDetector(_userAgent).IsMobile(),
				_userView,
				_counters
			);

			var content = ((IHtmlHelper)null).React("Server", serverProps);
			content?.WriteTo(writer, HtmlEncoder.Default);
		}
	}
}