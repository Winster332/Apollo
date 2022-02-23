using Apollo.Infrastructure.Serialization.Json;
using Apollo.Domain.SharedKernel;
using Apollo.Infrastructure.Tests.Helpers;
using Newtonsoft.Json;
using NUnit.Framework;

namespace Apollo.Infrastructure.Tests
{
	[TestFixture]
	public class DomainEventSerializationTests
	{
		[Test]
		public void IncludesTypeNamesWhenDealingWithEvents()
		{
			var evt = new SomeTestEvent(BusinessCallContext.System());
			var settings = new JsonSerializerSettings().SetupJsonFormatterSettings();
			var json = JsonConvert.SerializeObject(evt, settings);
			Assert.IsTrue(json.Contains("domainEventType"));
		}
	}
}