using Apollo.Web.Infrastructure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Files
{
	[UseDefaultBinder]
	public class FileUploadParameters
	{
		[FromForm] public IFormFile File { get; set; }
	}
}