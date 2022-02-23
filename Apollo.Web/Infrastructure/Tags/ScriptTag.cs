namespace Apollo.Web.Infrastructure.Tags
{
	/// <summary>
	/// Представление HTML-тега внешнего скриптового ресурса.
	/// </summary>
	public class ScriptTag: ExternalResourceTag
	{
		public ScriptTag(string link, bool clearCache)
			: base(link, clearCache, "\t<script src=\"{0}{1}\"></script>\r\n") { }
	}
}