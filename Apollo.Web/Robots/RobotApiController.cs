using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Apollo.Domain.Configuration;
using Apollo.Domain.EDS.Applications;
using Apollo.Domain.Extensions;
using Apollo.Web.Infrastructure;
using EventFlow;
using EventFlow.Queries;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Robots
{
	public class RobotApiController : BaseApiController
	{
		public RobotApiController(ICommandBus commandBus, IQueryProcessor queryProcessor, UniverseState universeState): base(commandBus, queryProcessor, universeState)
		{
		}

		private async Task ExecuteRequest(TestHttpRequest request)
		{
			var ms = new HttpRequestMessage(HttpMethod.Get, "");
			var client = new HttpClient();
			await client.SendAsync(ms);
		}

		public Task<ActionResult<string>> ExecuteHttpRequest(TestHttpRequest req)
		{
			return "".AsTaskResult().AsActionResult();
		}
	}

	public enum HttpRequestMethod
	{
		Get,
		Post,
		Put,
		Patch,
		Delete,
		Head,
		Options
	}
	
	public enum HttpRequestBodyType
	{
		None,
		FormData,
		XWwwFormUrlencoded,
		Raw,
		Binary
	}

	public class HttpRequestFile
	{
		public string Name { get; }
		public string Type { get; }
		public long Size { get; }
		public byte[] Data { get; }

		public HttpRequestFile(string name, string type, long size, byte[] data)
		{
			Name = name;
			Type = type;
			Size = size;
			Data = data;
		}
	}
	public class HttpRequestBody
	{
		public HttpRequestBodyType Type { get; }
		public HttpCollectionKeyValue Headers { get; }
		public Maybe<string> Raw { get; }
		public Maybe<HttpCollectionKeyValue> FormData { get; }
		public Maybe<HttpCollectionKeyValue> XWwwFormUrlencoded { get; }
		public Maybe<HttpRequestFile> Binary { get; }

		public HttpRequestBody(
			HttpRequestBodyType type,
			HttpCollectionKeyValue headers,
			Maybe<string> raw,
			Maybe<HttpCollectionKeyValue> formData,
			Maybe<HttpCollectionKeyValue> xWwwFormUrlencoded,
			Maybe<HttpRequestFile> binary)
		{
			Type = type;
			Headers = headers;
			Raw = raw;
			FormData = formData;
			XWwwFormUrlencoded = xWwwFormUrlencoded;
			Binary = binary;
		}
	}

	public class HttpCollectionKeyValue
	{
		public IReadOnlyCollection<HttpKeyValue> Rows { get; }

		public HttpCollectionKeyValue(IReadOnlyCollection<HttpKeyValue> rows)
		{
			Rows = rows;
		}
	}

	public class HttpKeyValue
	{
		public string Key { get; }
		public string Value { get; }

		public HttpKeyValue(string key, string value)
		{
			Key = key;
			Value = value;
		}
	}
	
	public class TestHttpRequest
	{
		public HttpRequestMethod Method { get; }
		public HttpRequestBody Body { get; }
		public string Url { get; }
		
		public TestHttpRequest(HttpRequestMethod method, HttpRequestBody body, string url)
		{
			Method = method;
			Body = body;
			Url = url;
		}
	}
}