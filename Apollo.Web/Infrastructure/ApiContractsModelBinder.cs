using System;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Apollo.Infrastructure.Serialization.Json;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Newtonsoft.Json;

namespace Apollo.Web.Infrastructure
{
	public class ApiContractsModelBinder: IModelBinder
	{
		public async Task BindModelAsync(ModelBindingContext bindingContext)
		{
			try
			{
				var extractJsonFieldByModelName = new Regex(@"^\s*{\s*""" +
				                                            bindingContext.ModelName +
				                                            @""":\s*(?<data>.*)\s*}\s*$");

				using (var reader =
					new StreamReader(bindingContext.ActionContext.HttpContext.Request.Body,
						Encoding.UTF8))
				{
					var content = await reader.ReadToEndAsync();

					var modelData = extractJsonFieldByModelName.Match(content).Groups["data"]
						.Value;

					bindingContext.Result = ModelBindingResult.Success(
						JsonConvert.DeserializeObject(modelData, bindingContext.ModelType,
							Settings));
				}
			}
			catch (Exception ex)
			{
				bindingContext.ModelState.AddModelError(bindingContext.ModelName,
					$"Cannot convert value to {bindingContext.ModelType.Name}: {ex}");
			}
		}

		private static readonly JsonSerializerSettings Settings =
			new JsonSerializerSettings().SetupJsonFormatterSettings();
	}
}