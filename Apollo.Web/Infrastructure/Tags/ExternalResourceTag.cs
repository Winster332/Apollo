using System.IO;

namespace Apollo.Web.Infrastructure.Tags
{
	/// <summary>
	/// Базовый класс для HTML-тега подключаемого ресурса.
	/// </summary>
	public abstract class ExternalResourceTag
	{
		private readonly string _tag;

		/// <summary>
		/// Конструктор.
		/// </summary>
		/// <param name="link">Ссылка на ресурс.</param>
		/// <param name="clearCache">Признак необходимости сброса браузерного кеша.</param>
		/// <param name="template">Шаблон тега. Должен предполагать два параметра — ссылку и её строку запроса.</param>
		protected ExternalResourceTag(string link, bool clearCache, string template)
		{
			//todo fix
			var queryString = clearCache
				? "?" + 0
				: string.Empty;

			_tag = string.Format(template, link, queryString);
		}

		/// <summary>
		/// Записывает тег в переданный писатель.
		/// </summary>
		/// <param name="writer"></param>
		public void WriteTo(TextWriter writer) => writer.Write(_tag);
	}
}