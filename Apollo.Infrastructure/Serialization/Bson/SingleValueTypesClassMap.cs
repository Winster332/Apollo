using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using Apollo.Domain;
using EventFlow.ValueObjects;
using MongoDB.Bson.Serialization;
using MoreLinq.Extensions;

namespace Apollo.Infrastructure.Serialization.Bson
{
	public static class SingleValueTypesClassMap
	{
		public static void RegisterSingleValueTypes() =>
			AssemblyHelper.GetDomainAssembly()
				.DefinedTypes
				.Where(t => typeof(ISingleValueObject).IsAssignableFrom(t))
				.Select(type => {
					var map = new BsonClassMap(type);
					var creatorMap = map.MapCreator(type.CompileConstructorDelegate());
					var valueProperty = type.GetProperty("Value");
					creatorMap.SetArguments(new[] { valueProperty });

					if (!(map.DeclaredMemberMaps is List<BsonMemberMap> memberMaps))
						throw new InvalidOperationException(
							$"Unable to register SingleValueObject type {type.Name} for BSON serialization.");

					memberMaps.Add(new(map, valueProperty));

					return map;
				})
				.ForEach(BsonClassMap.RegisterClassMap);

		private static Delegate CompileConstructorDelegate(this Type type)
		{
			var constructorInfo =
				type.GetConstructors(BindingFlags.Instance | BindingFlags.Public |
				                     BindingFlags.NonPublic).First();

			var parameters = constructorInfo.GetParameters()
				.Select(p => Expression.Parameter(p.ParameterType, p.Name)).ToArray();

			// ReSharper disable once CoVariantArrayConversion
			var body = Expression.New(constructorInfo, parameters);
			var lambda = Expression.Lambda(body, parameters);

			return lambda.Compile();
		}
	}
}