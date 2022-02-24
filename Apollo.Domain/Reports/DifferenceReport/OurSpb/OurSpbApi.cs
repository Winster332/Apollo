using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Functional.Maybe;
using Newtonsoft.Json.Linq;

namespace Apollo.Domain.Reports.DifferenceReport.OurSpb
{
	public class OurSpbApi
	{
		private string _host = "https://gorod.gov.spb.ru";
		private string _api => $"{_host}/public_api/";
		private HttpClient _client;

		public OurSpbApi()
		{
			_client = new HttpClient();
		}

		internal async Task<OurSpbApiResponse<byte[]>> GetFile(string url)
		{
			try
			{
				var response = await _client.GetAsync(url);

				var data = await response.Content.ReadAsByteArrayAsync();
				
				return OurSpbApiResponse<byte[]>.Success(data);
			}
			catch (Exception ex)
			{
				return OurSpbApiResponse<byte[]>.Failure(ex);
			}
		}

		internal async Task<OurSpbApiResponse<OurSpbProblem>> GetProblemById(string id)
		{
			try
			{
				var response = await _client.SendAsync(Request("problems", id));

				if (response.StatusCode != HttpStatusCode.OK)
				{
					return OurSpbApiResponse<OurSpbProblem>.Failure($"HTTP RESPONSE NOT OK. [{response.StatusCode}]");
				}
				
				var json = JToken.Parse(await response.Content.ReadAsStringAsync());
				var questionPhotos = GetQuestionPhotos(json);
				var requestFiles = GetRequestFiles(json);
				var requestPhotos = GetRequestPhotos(json);
				
				return OurSpbApiResponse<OurSpbProblem>.Success(new OurSpbProblem(questionPhotos, requestFiles, requestPhotos));
			}
			catch (HttpRequestException ex)
			{
				return OurSpbApiResponse<OurSpbProblem>.Failure(ex);
			}
			catch (Exception ex)
			{
				return OurSpbApiResponse<OurSpbProblem>.Failure(ex);
			}

			IReadOnlyCollection<OurSpbFile> GetQuestionPhotos(JToken json)
			{
				return json["feed"]
					.ToArray()
					.Where(x => x["content_type"].ToObject<int>() == 33)
					.SelectMany(x => x["payload"]["photos"].ToArray())
					.Select(x => new OurSpbFile(
						x["original_name"].ToObject<string>(),
						$"{_host}{x["url"].ToObject<string>()}"
					))
					.ToArray();
			}

			IReadOnlyCollection<OurSpbFile> GetRequestFiles(JToken json)
			{
				var answer = json["feed"].ToArray().Where(x => x["content_type"].ToObject<int>() == 28);
				var payload = answer.Select(a => a["payload"]);
				return payload
					.SelectMany(x => x["files"].ToArray().Select(f => new OurSpbFile(
							f["original_name"].ToObject<string>(),
							$"{_host}{f["url"].ToObject<string>()}"
						))
						.ToArray())
					.ToArray();
			}

			IReadOnlyCollection<OurSpbFile> GetRequestPhotos(JToken json)
			{
				var answer = json["feed"].ToArray().Where(x => x["content_type"].ToObject<int>() == 28);
				var payload = answer.Select(a => a["payload"]);
				return payload
					.SelectMany(x => x["photos"].ToArray().Select(p => new OurSpbFile(
						p["original_name"].ToObject<string>(),
						$"{_host}{p["url"].ToObject<string>()}"
					)).ToArray())
					.ToArray();
			}
		}

		private HttpRequestMessage Request(string method, string id) => new (HttpMethod.Get, $"{_api}{method}/{id}");

		internal record OurSpbFile(string Name, string Url);

		internal record OurSpbProblem(IReadOnlyCollection<OurSpbFile> QuestionPhotos, IReadOnlyCollection<OurSpbFile> RequestFiles, IReadOnlyCollection<OurSpbFile> RequestPhotos);
		
		internal class OurSpbApiResponse<T>: IDisposable
		{
			public Maybe<T> Data { get; }
			public Maybe<string> Error { get; }
			
			public OurSpbApiResponse(Maybe<T> data, Maybe<string> error)
			{
				Data = data;
				Error = error;
			}

			public static OurSpbApiResponse<T> Success(T data) => new (data.ToMaybe(), Maybe<string>.Nothing);
			public static OurSpbApiResponse<T> Failure(string error) => new (Maybe<T>.Nothing, error.ToMaybe());
			public static OurSpbApiResponse<T> Failure(Exception error) => Failure(error.ToString());
			public static OurSpbApiResponse<T> Failure(HttpRequestException error) => Failure($"HTTP: [{error.StatusCode}]. Message: {error}");
			public void Dispose()
			{
			}
		}
	}
}