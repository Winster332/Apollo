using System.Linq;
using System.Threading.Tasks;
using Apollo.Infrastructure.Serialization.Bson;
using Apollo.Infrastructure.Tests.Helpers;
using MongoDB.Driver;
using NUnit.Framework;

namespace Apollo.Infrastructure.Tests.Integration
{
	[TestFixture]
	public class MongoSerializationTests
	{
		[Test]
		[Category("Integration")]
		public async Task CorrectlySerializesAndDeserializesEvents()
		{
			BsonSerializerSetup.SetupCustomSerialization();
			var mongoClient = new MongoClient(new MongoUrl("mongodb://localhost:27017"));

			var database = mongoClient.GetDatabase(DatabaseName);
			var collection = database.GetCollection<ExampleReadModel>(CollectionName);
			var originalReadModel = ExampleReadModel.Create();
			collection.InsertOne(originalReadModel);
			var cursor = await collection.FindAsync(_ => true);
			var deserializedReadModel = cursor.First();
			mongoClient.DropDatabase(DatabaseName);

			Assert.AreEqual(originalReadModel.Events.Count,
				deserializedReadModel.Events.Count);

			CollectionAssert.AreEqual(
				originalReadModel.Events.Select(evt => evt.GetType()),
				deserializedReadModel.Events.Select(evt => evt.GetType()));
		}

		private const string DatabaseName = "IntegrationTestTemporary";
		private const string CollectionName = "TempCollection";
	}
}