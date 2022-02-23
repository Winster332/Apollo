using System;
using System.Linq;
using Apollo.Domain;
using Apollo.Infrastructure.Serialization.Json;
using EventFlow;
using EventFlow.Aggregates;
using EventFlow.Core;
using EventFlow.Extensions;
using EventFlow.MongoDB.ReadStores;
using EventFlow.ReadStores;
using Functional.Maybe;
using MongoDB.Bson.Serialization;
using MoreLinq;

namespace Apollo.Infrastructure
{
	public static class EventFlowOptionsExtensions
	{
		public static IEventFlowOptions SetupBlumenkraftDomain(
			this IEventFlowOptions options,
			ReadModelRegistrationDescriptor registrationDescriptor)
		{
			var domainAssembly = AssemblyHelper.GetDomainAssembly();
			var types = domainAssembly.GetTypes();

			var locators = types
				.Where(t => typeof(IReadModelLocator).IsAssignableFrom(t))
				.ToArray();

			var readModels = types
				.Where(t => MongoDbReadModelType.IsAssignableFrom(t) && !t.IsAbstract)
				.ToArray();

			readModels.ForEach(rm => RegisterReadModel(rm, registrationDescriptor, options));

			options
				.AddDefaults(domainAssembly)
				.RegisterServices(r => {
					r.Register<IJsonSerializer, EventFlowJsonSerializer>();
					locators.ForEach(locator => r.Register(locator, locator));
				});

			return options;
		}

		public static void RegisterReadModel(Type readModel,
			ReadModelRegistrationDescriptor descriptor,
			IEventFlowOptions options)
		{
			var locatorInterface = readModel
				.GetInterfaces()
				.FirstMaybe(i =>
					i.IsGenericType &&
					i.GetGenericTypeDefinition() == OpenWithLocatorInterface);

			locatorInterface
				.Do(interfaceType =>
					options.CallBinaryGenericExtension(
						descriptor.WithLocator.TypeToCallMethodOn,
						descriptor.WithLocator.MethodName,
						readModel,
						interfaceType.GetGenericArguments()[0]));

			if (locatorInterface.IsNothing())
				options.CallUnaryGenericExtension(
					descriptor.WithoutLocator.TypeToCallMethodOn,
					descriptor.WithoutLocator.MethodName,
					readModel
				);
		}

		public static void SetupMongoSerialization()
		{
			var domainAssembly = AssemblyHelper.GetDomainAssembly();
			var types = domainAssembly.GetTypes();

			var aggregateRoots = types
				.Where(t => AggregateRootType.IsAssignableFrom(t) && !t.IsAbstract)
				.ToArray();

			aggregateRoots
				.Select(rootType => {
					var baseType = rootType.BaseType;
					// ReSharper disable once PossibleNullReferenceException
					var genericArguments = baseType.GetGenericArguments();
					var identityType = genericArguments[1];

					return MakeEventType(rootType, identityType);
				})
				.ForEach(eventBaseType => {
					CallHelpers.CallUnaryStaticGenericMethod(EventFlowOptionsExtensionsType,
						nameof(RegisterBaseEventClassMap), eventBaseType);

					types.Where(eventBaseType.IsAssignableFrom)
						.ForEach(eventType => CallHelpers.CallUnaryStaticGenericMethod(
							EventFlowOptionsExtensionsType,
							nameof(RegisterEventClassMap), eventType));
				});
		}

		private static Type MakeEventType(Type aggregate, Type aggregateId) =>
			BusinessAggregateEventType.MakeGenericType(aggregate, aggregateId);

		private static readonly Type MongoDbReadModelType = typeof(IMongoDbReadModel);
		private static readonly Type AggregateRootType = typeof(IAggregateRoot);

		private static readonly Type BusinessAggregateEventType =
			typeof(BusinessAggregateEvent<,>);

		private static readonly Type OpenWithLocatorInterface = typeof(IWithLocator<>);

		private static readonly Type EventFlowOptionsExtensionsType =
			typeof(EventFlowOptionsExtensions);

		private static void RegisterBaseEventClassMap<T>() =>
			BsonClassMap.RegisterClassMap<T>(map => {
				map.SetIsRootClass(true);
				map.AutoMap();
			});


		private static void RegisterEventClassMap<T>() => BsonClassMap.RegisterClassMap<T>();
	}

	public struct ReadModelRegistrationDescriptor
	{
		public ReadModelRegistrationDescriptor(
			ReadModelKindRegistrationDescriptor withoutLocator,
			ReadModelKindRegistrationDescriptor withLocator)
		{
			WithoutLocator = withoutLocator;
			WithLocator = withLocator;
		}

		public ReadModelKindRegistrationDescriptor WithoutLocator { get; }

		public ReadModelKindRegistrationDescriptor WithLocator { get; }

		public static ReadModelRegistrationDescriptor Create(Type typeToCallMethodsOn,
			string methodName) =>
			new(
				new(typeToCallMethodsOn, methodName),
				new(typeToCallMethodsOn, methodName));
	}

	public struct ReadModelKindRegistrationDescriptor
	{
		public ReadModelKindRegistrationDescriptor(
			Type typeToCallMethodOn,
			string methodName)
		{
			TypeToCallMethodOn = typeToCallMethodOn;
			MethodName = methodName;
		}

		public Type TypeToCallMethodOn { get; }

		public string MethodName { get; }
	}
}