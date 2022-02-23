using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Apollo.Infrastructure;
using Apollo.Domain;
using Apollo.Infrastructure.Serialization;
using Apollo.Web.Infrastructure.React;
using EventFlow.Aggregates;
using EventFlow.Extensions;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;
using MoreLinq.Extensions;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Fluent;
using TypePredicate = System.Func<System.Type, bool>;
using PropertiesGetter =
	System.Func<System.Type,
		System.Collections.Generic.IEnumerable<System.Reflection.PropertyInfo>>;

namespace Apollo.Web.Infrastructure.Typings
{
	public class ExportableTypesContainer
	{
		private readonly List<Type> _reactControllers;
		private readonly List<Type> _apiControllers;
		private readonly List<Type> _signalrHubs;
		private readonly List<Type> _interfaces;
		private readonly List<Type> _enums;
		private readonly List<Type> _singleValueObjects;
		private readonly List<Type> _identities;
		private readonly Dictionary<string, SpecialTypesCategory> _specialTypes;
		private readonly TypingsLogger _logger;

		public ExportableTypesContainer(TypingsLogger logger)
		{
			_logger = logger;
			_interfaces = new();
			_enums = new();
			_reactControllers = new();
			_apiControllers = new();
			_signalrHubs = new();
			_singleValueObjects = new();
			_identities = new();
			_specialTypes = new();
		}

		public ExportableTypesContainer Build(
			Type[] reactControllers,
			Type[] apiControllers,
			Type[] signalrHubs,
			Type[] domainEventTypes)
		{
			_logger.StartSection("Building types container:");

			AddTypeToExport(typeof(ServerProps));
			_reactControllers.AddRange(reactControllers);
			_apiControllers.AddRange(apiControllers);
			_signalrHubs.AddRange(signalrHubs);

			var signalrHubClients = signalrHubs
				.Select(hubType => hubType.BaseType.GenericTypeArguments[0])
				.ToArray();

			var typesUsedInSignalr = signalrHubClients
				.SelectMany(clientType =>
					clientType
						.GetMethods()
						.SelectMany(method => method
							.GetParameters()
							.Select(parameter => parameter.ParameterType)));

			var typesUsedInControllers = apiControllers
				.Concat(reactControllers)
				.SelectMany(type =>
					type
						.GetMethods()
						.Where(methodInfo => IsAllowedMethod(methodInfo, type))
						.SelectMany(method =>
							method
								.GetParameters()
								.Select(param => param.ParameterType)
								.Concat(new[] { method.ReturnType })
						));

			domainEventTypes
				.Concat(typesUsedInSignalr)
				.Concat(typesUsedInControllers)
				.ForEach(AddTypeToExport);

			_logger.EndSection();

			Instance = this;

			return this;
		}

		public void Export(ConfigurationBuilder builder)
		{
			builder.ExportAsClasses(_apiControllers, c => c
				.WithPublicMethods(m => m.WithCodeGenerator<ActionCallGenerator>())
				.WithCodeGenerator<ApiControllerProxyGenerator>());

			builder.ExportAsClasses(_reactControllers, c => c
				.WithMethods(methodInfo => IsAllowedMethod(methodInfo, c.Type),
					m => m.WithCodeGenerator<CreateUrlGenerator>())
				.WithCodeGenerator<ReactControllerProxyGenerator>());

			_logger.StartSection("Interfaces:");
			_logger.LogLines(_interfaces.Select(f => f.ToString()));
			_logger.EndSection();

			builder.ExportAsInterfaces(
				_interfaces,
				i => i
					.WithProperties(BindingFlags.Instance | BindingFlags.Public |
					                BindingFlags.NonPublic)
			);

			_logger.StartSection("Single Value Objects:");
			_logger.LogLines(_singleValueObjects.Select(f => f.ToString()));
			_logger.EndSection();


			_singleValueObjects.ForEach(singleValueObjectType =>
				builder.Substitute(
					singleValueObjectType,
					singleValueObjectType.GetTypescriptTypeForSingleValueObjectType())
			);

			_logger.StartSection("Identities:");
			_logger.LogLines(_identities.Select(f => f.ToString()));
			_logger.EndSection();

			_identities.ForEach(identity =>
				builder.Substitute(
					identity,
					StringType
				)
			);

			_specialTypes.ForEach(kvp => {
				var (categoryName, category) = kvp;
				var (types, group) = category;

				_logger.StartSection(categoryName + ":");
				_logger.LogLines(types.Select(t => t.ToString()));
				_logger.EndSection();

				switch (group.ExportType)
				{
					case ExportType.Class:
						builder.ExportAsClasses(types,
							typeBuilder => {
								var exportingProperties =
									group.PropertiesGetter(typeBuilder.Type).ToArray();

								typeBuilder
									.FlattenHierarchy()
									.WithProperties(prop =>
										exportingProperties.Contains(prop,
											PropertyEqualityComparer.Instance));

								group.CodeGeneratorType.Do(t =>
									typeBuilder.CallUnaryGenericExtension(
										typeof(TypeExportExtensions),
										nameof(TypeExportExtensions.WithCodeGenerator),
										t));
							});

						break;
					case ExportType.Interface:
						builder.ExportAsInterfaces(types,
							typeBuilder => {
								var exportingProperties =
									group.PropertiesGetter(typeBuilder.Type).ToArray();

								typeBuilder
									.FlattenHierarchy()
									.WithProperties(prop =>
										exportingProperties.Contains(prop,
											PropertyEqualityComparer.Instance));

								group.CodeGeneratorType.Do(t =>
									typeBuilder.CallUnaryGenericExtension(
										typeof(TypeExportExtensions),
										nameof(TypeExportExtensions.WithCodeGenerator),
										t));
							});

						break;
					default:
						throw new ArgumentOutOfRangeException();
				}
			});

			_logger.StartSection("Enums:");
			_logger.LogLines(_enums.Select(f => f.ToString()));
			_logger.EndSection();

			builder.ExportAsEnums(_enums);

			// Это, конечно, хак, но нам нужен какой-то тип дженерика для запуска кодогенератора.
			builder.ExportAsClass<ExportableTypesContainer>()
				.WithCodeGenerator<DomainEventMapGenerator>();
		}

		private void AddTypeToExport(Type type)
		{
			_logger.StartSection(type.ToString());
			AddTypeToExportImpl(type);
			_logger.EndSection(false);
		}

		private void AddTypeToExportImpl(Type type)
		{
			if (ShouldBeSkipped(type) || AlreadyProcessed(type)) return;

			if (type.IsSingleValueObjectType())
			{
				_singleValueObjects.Add(type);

				return;
			}

			if (type.IsIdentityType())
			{
				_identities.Add(type);

				return;
			}

			if (type.IsEnum)
			{
				_enums.Add(type);

				return;
			}

			if (type.IsArray)
			{
				var arrayType = type.GetElementType();
				AddTypeToExport(arrayType);

				return;
			}

			if (type.IsGenericType && type.IsConstructedGenericType)
			{
				var typeDefinition = type.GetGenericTypeDefinition();
				Console.WriteLine(type.ToString());

				if (UnwrappableGenerics.Any(t => t.IsAssignableFrom(typeDefinition)))
				{
					var genericType = type.GetGenericArguments()[0];
					AddTypeToExport(genericType);

					return;
				}

				AddTypeToExport(typeDefinition);

				type
					.GetGenericArguments()
					.ForEach(AddTypeToExport);

				return;
			}

			var specialTypeDescriptor =
				SpecialTypes.FirstMaybe(specialType => specialType.Predicate(type));

			if (type.IsClass || type.IsInterface || type.IsValueType)
				specialTypeDescriptor
					.Select(d => {
						var category = _specialTypes.GetOrCreate(d.GroupName, _ => new(d));
						category.Add(type);

						return d.PropertiesGetter(type);
					})
					.OrElse(() => {
						_interfaces.Add(type);

						return type.GetProperties();
					})
					.ForEach(p => AddTypeToExport(p.PropertyType));

			if (type.BaseType != null && specialTypeDescriptor.IsNothing())
				AddTypeToExport(type.BaseType);
		}

		private bool AlreadyProcessed(Type type) =>
			_interfaces.Contains(type)
			|| _enums.Contains(type)
			|| _identities.Contains(type)
			|| _specialTypes.Any(c => c.Value.Contains(type))
			|| _singleValueObjects.Contains(type);

		private static bool ShouldBeSkipped(Type type) =>
			TypesToSkip.Contains(type)
			|| PrimitiveTypes.Contains(type)
			|| TypeScriptTypeConverter.HasSubstitution(type)
			|| type.IsGenericParameter
			|| type.IsGenericType && TypesToSkip.Contains(type.GetGenericTypeDefinition());

		private static bool IsAllowedMethod(MethodInfo methodInfo, Type type) =>
			methodInfo.IsPublic
			&& !methodInfo.IsStatic
			&& methodInfo.DeclaringType == type
			&& MethodReturnTypeIsAllowed(methodInfo)
			&& (!typeof(ReactController).IsAssignableFrom(type)
			    || methodInfo.GetCustomAttribute<HttpPostAttribute>() == null
			    && methodInfo.GetCustomAttribute<PreventTypingsCreationAttribute>() == null);

		private static bool MethodReturnTypeIsAllowed(MethodInfo methodInfo)
		{
			var returnType = methodInfo.ReturnType;

			return returnType != typeof(ActionResult) && returnType != typeof(Task) &&
			       returnType != typeof(Task<ActionResult>);
		}

		private static readonly Type[] PrimitiveTypes =
		{
			typeof(object), typeof(string), typeof(char), typeof(bool), typeof(byte),
			typeof(sbyte), typeof(short), typeof(ushort), typeof(int), typeof(uint),
			typeof(long), typeof(ulong), typeof(float), typeof(double), typeof(decimal),
			typeof(ValueType)
		};

		private static readonly Type[] UnwrappableGenerics =
		{
			typeof(IEnumerable<>), typeof(IReadOnlyCollection<>), typeof(TypedResult<>),
			typeof(ActionResult<>), typeof(Maybe<>), typeof(Task<>), typeof(Nullable<>)
		};

		private static readonly Type[] TypesToSkip =
		{
			typeof(FileResult), typeof(ActionResult), typeof(FileContentResult),
			typeof(AggregateEvent<,>), typeof(BusinessAggregateEvent<,>)
		};

		private static readonly RtTypeName StringType = new RtSimpleTypeName("string");

		private static readonly SpecialTypeGroup[] SpecialTypes =
		{
			new(
				"Commands",
				ExportableTypesHelper.IsCommandType,
				ExportableTypesHelper.GetCommandProperties,
				ExportType.Interface),
			new(
				"Events",
				TypeHelpers.IsEventType,
				ExportableTypesHelper.GetEventProperties,
				ExportType.Class,
				typeof(DomainEventGenerator).ToMaybe())
		};

		public static ExportableTypesContainer Instance { get; private set; }

		public IReadOnlyCollection<Type> Events =>
			_specialTypes
				.FirstMaybe(kvp => kvp.Key == "Events")
				.Select(kvp => kvp.Value.RegisteredTypes)
				.OrElse(Array.Empty<Type>);
	}

	internal class SpecialTypeGroup
	{
		public SpecialTypeGroup(
			string groupName,
			TypePredicate predicate,
			PropertiesGetter propertiesGetter,
			ExportType exportType,
			Maybe<Type> codeGeneratorType = default)
		{
			GroupName = groupName;
			Predicate = predicate;
			PropertiesGetter = propertiesGetter;
			ExportType = exportType;
			CodeGeneratorType = codeGeneratorType;
		}

		public string GroupName { get; }

		public TypePredicate Predicate { get; }

		public PropertiesGetter PropertiesGetter { get; }

		public ExportType ExportType { get; }

		public Maybe<Type> CodeGeneratorType { get; }
	}

	internal enum ExportType
	{
		Class,
		Interface
	}
}