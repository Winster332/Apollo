using Apollo.Infrastructure.Serialization.Bson;
using Functional.Maybe;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using NUnit.Framework;

namespace Apollo.Infrastructure.Tests
{
	[TestFixture]
	public class MaybeSerializationTests
	{
		[Test]
		public void CorrectlySerializesAndDeserializesMaybeWithValue()
		{
			var initialValue = new TestClass { Wrapped = 5.ToMaybe() };
			var bson = initialValue.ToBson();
			var valueAfterDeserialization = BsonSerializer.Deserialize<TestClass>(bson);

			Assert.AreEqual(initialValue.Wrapped.HasValue,
				valueAfterDeserialization.Wrapped.HasValue);

			Assert.AreEqual(initialValue.Wrapped.Value,
				valueAfterDeserialization.Wrapped.Value);
		}

		[Test]
		public void CorrectlySerializesAndDeserializesMaybeWithoutValue()
		{
			var initialValue = new TestClass();
			var bson = initialValue.ToBson();
			var valueAfterDeserialization = BsonSerializer.Deserialize<TestClass>(bson);

			Assert.AreEqual(initialValue.Wrapped.HasValue,
				valueAfterDeserialization.Wrapped.HasValue);
		}

		[OneTimeSetUp]
		public void Init() =>
			BsonSerializer.RegisterSerializationProvider(new MaybeSerializationProvider());
	}

	internal class TestClass
	{
		public Maybe<int> Wrapped { get; set; }
	}
}