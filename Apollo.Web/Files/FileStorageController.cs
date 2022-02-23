using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Configuration;
using Apollo.Domain.Files;
using Apollo.Domain.SharedKernel;
using Apollo.Web.Applications;
using Apollo.Web.Infrastructure;
using Apollo.Web.Infrastructure.React;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Files
{
	public class FileStorageController : ReactController
	{
		public FileStorageController(
			ICommandBus commandBus, 
			IQueryProcessor queryProcessor, 
			UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}
		
		[PreventTypingsCreation]
		[HttpPost]
		[DisableRequestSizeLimit]
		[RequestFormLimits(MultipartBodyLengthLimit = long.MaxValue)]
		public async Task<ActionResult<ExecutionResult<FileId>>> Upload(FileUploadParameters parameters)
		{
			var fileStream = parameters.File.OpenReadStream();
			var fileName = new FileName(parameters.File.FileName);
			var nameAndExtension = fileName.Value.Split('.');
			var extension = new FileExtension(nameAndExtension[1]);
			var userId = ControllerContext.HttpContext.FindUserId();

			return await CommandBus.PublishAsync(new UpdateFile(
				Maybe<FileId>.Nothing, 
				fileName,
				extension, 
				fileStream,
				userId), CancellationToken.None);
		}
	}
}