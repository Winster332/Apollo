using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.Configuration;
using Apollo.Domain.Files;
using Apollo.Domain.SharedKernel;
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
			var bytes = Array.Empty<byte>();

			await using (var memStream = new MemoryStream())
			{
				await fileStream.CopyToAsync(memStream);
				bytes = memStream.ToArray();
			}

			return await CommandBus.PublishAsync(new UpdateFile(
				Maybe<FileId>.Nothing, 
				fileName,
				extension, 
				bytes), CancellationToken.None);
		}
	}
}