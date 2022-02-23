using System.Linq;
using System.Reflection;
using Apollo.Domain;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MoreLinq;

namespace Apollo.Infrastructure.Serialization.Bson
{
	/// <summary>
	/// Конвенция маппинга рид-моделей классов на MongoDB-модели.
	/// Реализует следующую логику:
	/// Если объект является частью нашей доменной модели,
	/// то добавим в сериализацию также все гет-онли свойства. 
	/// </summary>
	public class ReadModelsClassMapConvention: ConventionBase, IClassMapConvention
	{
		public void Apply(BsonClassMap classMap)
		{
			var domainAssembly = AssemblyHelper.GetDomainAssembly();
			var type = classMap.ClassType;

			if (classMap.ClassType.IsAbstract) return;

			if (type.Assembly != domainAssembly) return;

			type.GetProperties(BindingFlags.Public | BindingFlags.Instance)
				.Where(prop => prop.GetSetMethod() == null
				               && prop.DeclaringType ==
				               type) // защищает нас от типа StructureView[], который имеет все св-ва типа Array, но определён в нашей сборке
				.ForEach(prop => classMap.MapMember(prop));
		}
	}
}