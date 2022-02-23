namespace Apollo.Web.Infrastructure.Tags
{
	/// <summary>
	/// Представление HTML-тега внешнего CSS-ресурса..
	/// </summary>
	public class StyleTag: ExternalResourceTag
	{
		public StyleTag(string link, bool clearCache)
			: base(link, clearCache, "\t<link rel=\"stylesheet\" href=\"{0}{1}\" />\r\n") { }
	}
}