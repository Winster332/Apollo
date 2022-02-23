using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Configuration;
using Apollo.Domain.Files;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Files
{
	public class FileStorageApiController : BaseApiController
	{
		public FileStorageApiController(
			ICommandBus commandBus, 
			IQueryProcessor queryProcessor, 
			UniverseState universeState,
			FileStorageConfiguration fileStorageConfiguration): base(commandBus, queryProcessor, universeState)
		{
			_fileStorageConfiguration = fileStorageConfiguration;
		}

		private readonly FileStorageConfiguration _fileStorageConfiguration;
		
		[HttpGet]
		public async Task<ActionResult<FileId>> Download(string fileId)
		{
			var file = FileId.With(fileId);
			var result = await QueryProcessor.ProcessAsync(new FileByIdQuery(file), CancellationToken.None);
			
			if (result.IsNothing())
			{
				return NotFound();
			}

			var filePath = Path.Combine(_fileStorageConfiguration.Directory.Value,
				$"{result.Value.Id}.{result.Value.Extension.Value}");
			var fileStream = System.IO.File.OpenRead(filePath);

			var mime = result.Value.Extension.Value switch
			{
				"jpg" => "image/jpg",
				"png" => "image/png",
				"bmp" => "image/bmp",
				_ => "application/octet-stream"
			};
			
			Response.Headers.Add("Content-Disposition", "inline");
			
			return File(fileStream, mime);
		}
	}
}