using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Xml;
using System.Xml.Serialization;
using Flurl.Http;
using Flurl.Http.Content;
using MoreLinq;

namespace Apollo.Domain.Extensions
{
	public static class FlurlExtensions
	{
		private const string AuthHeaderName = "Authorization";
		private static bool CheckAuthenticationHeader(IFlurlRequest fc, string headerName, string headerValue)
		{
			if (headerName == AuthHeaderName && !fc.Client.HttpClient.DefaultRequestHeaders.Contains(AuthHeaderName))
			{
				var pair = headerValue.Split(' ');
				var scheme = pair.First();
				var token = pair.Last();
				fc.Client.HttpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(scheme, token);
			}

			return headerName == AuthHeaderName;
		}

		public static async Task<IFlurlResponse> PostXmlAsync(this IFlurlRequest fc, string xml) {
			var content = new CapturedStringContent(xml);
			content.Headers.Clear();
			content.Headers.ContentType = new MediaTypeHeaderValue("text/xml");
			
			foreach (var valueTuple in fc.Headers)
			{
				try
				{
					if (CheckAuthenticationHeader(fc, valueTuple.Name, valueTuple.Value))
					{
						continue;
					}

					content.Headers.Add(valueTuple.Name, valueTuple.Value);
				}
				catch (Exception ex)
				{
					Console.WriteLine(ex);
				}
			}
			
			var response = await fc.Client.HttpClient.PostAsync(fc.Url, content);
			return new FlurlResponse(response);
		}

		public static Task<IFlurlResponse> PostXmlAsync(this IFlurlRequest fc, string host, string method, IDictionary<string, object> xml) 
			=> PostXmlAsync(fc, XmlRequest(host, method, xml));

		private static string XmlRequest(string host, string method, IDictionary<string, object> fields)
			=> @$"<?xml version=""1.0"" encoding=""utf-8""?>
<soap:Envelope xmlns:soap=""http://schemas.xmlsoap.org/soap/envelope/"">
	<soap:Body>
		<{method} xmlns=""{host}"">
			{string.Join('\n', fields.Select(c => c.Value == null ? $"\t\t\t<{c.Key}/>" : $"\t\t\t<{c.Key}>{c.Value}</{c.Key}>"))}
		</{method}>
	</soap:Body>
</soap:Envelope>";
		
		public static async Task<XmlDocument> GetXmlAsync(this IFlurlResponse response)
		{
			var content = await response.GetStringAsync();
			var document = new XmlDocument();
			document.LoadXml(content);

			return document;
		}
		
		public static async Task<T> GetXmlAsync<T>(this IFlurlResponse response) where T : class
		{
			var content = await response.GetStringAsync();
			
			using(var reader = new System.IO.StringReader(content))
			{
				var serializer = new XmlSerializer(typeof(T));
				return serializer.Deserialize(reader) as T;
			}
		}
	}
}