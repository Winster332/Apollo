using System.Net;
using Apollo.Domain.Configuration;
using EventFlow;
using EventFlow.Queries;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Infrastructure
{
	/// <summary>
	/// Базовый класс для контроллеров API. Предпочтительный метод ограничения доступа для ролей и выбрасывания исключений.
	/// </summary>
	public abstract class BaseApiController: Controller
	{
		protected BaseApiController(ICommandBus commandBus, IQueryProcessor queryProcessor,
			UniverseState universeState)
		{
			CommandBus = commandBus;
			QueryProcessor = queryProcessor;
			UniverseState = universeState;
		}

		protected UniverseState UniverseState { get; }

		protected ICommandBus CommandBus { get; }

		protected IQueryProcessor QueryProcessor { get; }


		/// <summary>
		///     Вернуть клиенту код <paramref name="code" /> и техническое сообщение <paramref name="message" />
		///     <remarks>Внимание! Только ASCII-символы в сообщении</remarks>
		/// </summary>
		/// <param name="message">Внимание! Только ASCII-символы в сообщении</param>
		/// <param name="code"></param>
		protected ActionResult<T> HttpThrow<T>(string message,
			HttpStatusCode code = HttpStatusCode.BadRequest) =>
			new ContentResult { StatusCode = (int)code, Content = message };
	}
}