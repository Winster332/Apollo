using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using JetBrains.Annotations;
using Reinforced.Typings;
using Reinforced.Typings.Ast;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Generators;

namespace Apollo.Web.Infrastructure.Typings
{
	[UsedImplicitly]
	public class DomainEventGenerator: ClassCodeGenerator
	{
		public override RtClass GenerateNode(Type eventType, RtClass result,
			TypeResolver resolver)
		{
			try
			{
				result = base.GenerateNode(eventType, result, resolver);

				if (result == null) return null;

				var orderedFields = result.Members
					.OfType<RtField>()
					.OrderBy(prop => prop.Identifier.IdentifierName)
					.ToArray();

				result.Members.Add(CreateTypeGuard(eventType, resolver));
				result.Members.Add(CreateConstructor(orderedFields));
				result.Members.Add(CreateDeserializer(orderedFields, result.Name));

				return result;
			}
			catch (Exception ex)
			{
				File.AppendAllText(@"C:\temp\reinforced.log.txt", ex.ToString());

				return null;
			}
		}

		private static RtFunction CreateTypeGuard(Type eventType, TypeResolver resolver)
		{
			var typeName = resolver.ResolveTypeName(eventType);

			return new()
			{
				AccessModifier = AccessModifier.Public,
				IsStatic = true,
				ReturnType = new RtSimpleTypeName($"data is {typeName}"),
				Identifier = new("is"),
				Arguments = { DataArgument },
				Body = new($"return data instanceof {typeName};")
			};
		}

		private static RtConstructor CreateConstructor(RtField[] fields) =>
			new()
			{
				Body = new(fields
					.Select(prop =>
						$"this.{prop.Identifier.IdentifierName} = {prop.Identifier.IdentifierName};")
					.StringJoin("\r\n")),
				Arguments = fields
					.Select(prop =>
						new RtArgument { Identifier = prop.Identifier, Type = prop.Type })
					.ToList(),
				AccessModifier = AccessModifier.Public
			};

		private static RtFunction CreateDeserializer(RtField[] fields, RtTypeName type)
		{
			var constructorArguments = fields
				.Select(field =>
					$"\tfromServer(data['{field.Identifier.IdentifierName}']) as {field.Type}")
				.StringJoin(",\r\n");

			return new()
			{
				Identifier = new("create"),
				AccessModifier = AccessModifier.Public,
				IsStatic = true,
				Arguments = { DataArgument },
				Body = new($"return new {type}(\r\n{constructorArguments});")
			};
		}

		private static readonly RtArgument DataArgument =
			new() { Type = new RtSimpleTypeName("any"), Identifier = new("data") };
	}

	public static class EnumerableExtensions
	{
		public static string StringJoin(this IEnumerable<string> arr, string separator) =>
			string.Join(separator, arr);
	}
}