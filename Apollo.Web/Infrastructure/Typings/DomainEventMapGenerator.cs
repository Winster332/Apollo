using System;
using System.Linq;
using Reinforced.Typings;
using Reinforced.Typings.Ast;
using Reinforced.Typings.Generators;

namespace Apollo.Web.Infrastructure.Typings
{
	public class DomainEventMapGenerator: ClassCodeGenerator
	{
		public override RtClass GenerateNode(Type eventType, RtClass result,
			TypeResolver resolver) =>
			new() { Name = new("DomainEventMap"), Members = { GetMapCreatorFunction() } };

		private static RtFunction GetMapCreatorFunction()
		{
			// Плохо. Но что делать?
			var domainEventTypesMap = ExportableTypesContainer.Instance.Events
				.Select(eventType => $"map.set('{eventType.Name}', {eventType.Name});")
				.StringJoin("\r\n");

			return new()
			{
				Identifier = new("create"),
				IsStatic = true,
				AccessModifier = AccessModifier.Public,
				Body = new($@"const map = new Map<string, any>();
{domainEventTypesMap}
return map;")
			};
		}
	}
}