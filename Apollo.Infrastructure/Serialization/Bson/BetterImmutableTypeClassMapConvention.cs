using System;
using System.Linq;
using System.Reflection;
using System.Runtime.CompilerServices;
using Apollo.Domain;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MoreLinq;

namespace Apollo.Infrastructure.Serialization.Bson
{
	/// <summary>
	/// Конвенция маппинга неизменяемых классов на MongoDB-модели.
	/// Реализует следующую логику:
	/// Выбираем все автосвойства объекта. Если у объекта есть конструктор, который принимает значения всех оных автосв-в,
	/// то все автосвойства сериализуем в BSON, а создавать объект впоследствии будем с использованием этого конструктора.
	/// </summary>
	public class BetterImmutableTypeClassMapConvention: ConventionBase, IClassMapConvention
	{
		public void Apply(BsonClassMap classMap)
		{
			var domainAssembly = AssemblyHelper.GetDomainAssembly();
			var type = classMap.ClassType;

			if (classMap.ClassType.IsAbstract) return;

			if (type.GetConstructor(Type.EmptyTypes) != null) return;

			var properties = type.GetProperties();

			var autoGenProperties = properties
				.Where(prop => prop
					.GetGetMethod()
					.GetCustomAttributes(typeof(CompilerGeneratedAttribute), true)
					.Any())
				.ToArray();

			var allConstructors =
				type.GetConstructors(BindingFlags.Public | BindingFlags.NonPublic |
				                     BindingFlags.Instance);

			var matchingConstructors = allConstructors
				.Where(ctor => {
					var parameters = ctor.GetParameters();

					if (parameters.Length != autoGenProperties.Length &&
					    type.Assembly != domainAssembly)
						return false;

					var matches = parameters
						.GroupJoin(properties,
							parameter => parameter.Name,
							property => property.Name,
							(parameter, props) =>
								new { Parameter = parameter, Properties = props },
							StringComparer.OrdinalIgnoreCase);

					if (matches.Any(m => m.Properties.Count() != 1)) return false;

					return true;
				})
				.ToArray();

			if (matchingConstructors.Any())
			{
				classMap.Reset();
				matchingConstructors.ForEach(ctor => classMap.MapConstructor(ctor));

				autoGenProperties.Where(prop => prop.DeclaringType == type)
					.ForEach(prop => classMap.MapMember(prop));
			}
		}
	}
}