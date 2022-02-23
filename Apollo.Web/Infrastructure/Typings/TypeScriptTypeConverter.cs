using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Apollo.Domain;
using Apollo.Domain.SharedKernel;
using Apollo.Infrastructure.Serialization;
using Apollo.Web.Infrastructure.React;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;
using MoreLinq.Extensions;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Fluent;

namespace Apollo.Web.Infrastructure.Typings
{
	public static class TypeScriptTypeConverter
	{
		public static void SetupConversion(this ConfigurationBuilder builder)
		{
			builder.SubstituteGeneric(
				typeof(Task<>),
				(type, typeResolver) =>
					typeResolver.ResolveTypeName(type.GetGenericArguments().Single()));

			builder.SubstituteGeneric(
				typeof(TypedResult<>),
				(type, typeResolver) =>
					typeResolver.ResolveTypeName(type.GetGenericArguments().Single()));

			builder.SubstituteGeneric(
				typeof(ActionResult<>),
				(type, typeResolver) =>
					new RtSimpleTypeName(
						$"Promise<{typeResolver.ResolveTypeName(type.GetGenericArguments().Single())}>"));

			builder.SubstituteGeneric(
				typeof(Maybe<>),
				(type, typeResolver) =>
					new RtSimpleTypeName(
						$"({typeResolver.ResolveTypeName(type.GetGenericArguments().Single())} | null)"));

			builder.SubstituteGeneric(
				TypeHelpers.OpenBusinessAggregateEventType,
				(type, typeResolver) => DomainEventTypesSubstitutions[type]
			);


			ComplexTypesSubstitutions.ForEach(cto => builder.Substitute(cto.Key, cto.Value));
		}

		public static RtTypeName GetTypescriptTypeForSingleValueObjectType(this Type type)
		{
			var underlyingType = type.BaseType.GetGenericArguments()[0];

			return SingleValueTypeSubstitutionGetter(underlyingType)
				.Or(() => SubstitutionGetter(underlyingType))
				.OrElse(() => new ArgumentException(
					"Invalid SingleValueObject-inherited type is being exported. " +
					$"Type is {type.FullName}, underlying type is {underlyingType}. " +
					$"Please provide proper substitution in {nameof(TypeScriptTypeConverter)}",
					nameof(type)));
		}

		private static readonly Dictionary<Type, RtTypeName> SingleValueTypeSubstitutions =
			new() { { typeof(string), new RtSimpleTypeName("string") } };

		private static readonly Func<Type, Maybe<RtTypeName>> SingleValueTypeSubstitutionGetter
			= MaybeFunctionalWrappers.Wrap<Type, RtTypeName>(SingleValueTypeSubstitutions
				.TryGetValue);

		public static bool HasSubstitution(Type type) =>
			SubstitutionGetter(type).IsSomething();

		private static readonly Dictionary<Type, RtTypeName> ComplexTypesSubstitutions =
			new()
			{
				{ typeof(DateTime), new RtSimpleTypeName("dayjs.Dayjs") },
				{ typeof(Date), new RtSimpleTypeName("dayjs.Dayjs") },
				{ typeof(Guid), new RtSimpleTypeName("string") },
				{ typeof(Guid?), new RtSimpleTypeName("string | null") },
				{ typeof(DateTime?), new RtSimpleTypeName("string | null") },
				{ typeof(int), new RtSimpleTypeName("number") },
				{ typeof(decimal), new RtSimpleTypeName("number") },
				{ typeof(double), new RtSimpleTypeName("number") },
				{ typeof(float), new RtSimpleTypeName("number") },
				{ typeof(int?), new RtSimpleTypeName("number | null") },
				{ typeof(decimal?), new RtSimpleTypeName("number | null") },
				{ typeof(double?), new RtSimpleTypeName("number | null") },
				{ typeof(float?), new RtSimpleTypeName("number | null") },
				{
					typeof(Dictionary<string, int>),
					new RtSimpleTypeName("{ [key: string]: number }")
				},
				{ typeof(FileContentResult), new RtSimpleTypeName("any") }
			};

		private static readonly Func<Type, Maybe<RtTypeName>> SubstitutionGetter =
			MaybeFunctionalWrappers.Wrap<Type, RtTypeName>(
				ComplexTypesSubstitutions.TryGetValue);

		static TypeScriptTypeConverter() =>
			DomainEventTypesSubstitutions = AssemblyHelper.GetDomainAssembly()
				.GetTypes()
				.Where(TypeHelpers.IsEventType)
				.GroupBy(evt => evt.BaseType)
				.ToDictionary(
					g => g.Key,
					g => new RtSimpleTypeName(
						"(" +
						string.Join(" | ", g.Select(t => t.Name)) +
						")"));

		private static readonly Dictionary<Type, RtSimpleTypeName>
			DomainEventTypesSubstitutions;
	}
}