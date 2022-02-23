using System;
using JetBrains.Annotations;
using Reinforced.Typings;
using Reinforced.Typings.Ast;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Generators;

namespace Apollo.Web.Infrastructure.Typings
{
	[UsedImplicitly]
	public class ApiControllerProxyGenerator: ClassCodeGenerator
	{
		public override RtClass GenerateNode(Type controller, RtClass result,
			TypeResolver resolver)
		{
			try
			{
				result = base.GenerateNode(controller, result, resolver);

				if (result == null) return null;

				result.Extendee = null;

				result.Name = new(result.Name.TypeName + "Proxy",
					result.Name.GenericArguments);

				result.Documentation = new()
				{
					Description = "Result of ApiControllerProxyGenerator activity"
				};

				var httpServiceType = new RtSimpleTypeName("HttpService");

				result.Members.Add(new RtField
				{
					Type = httpServiceType,
					Identifier = new("http"),
					AccessModifier = AccessModifier.Public
				});

				var constructor = new RtConstructor { Body = new("this.http = http;") };

				constructor.Arguments.Add(new()
				{
					Type = httpServiceType, Identifier = new("http")
				});

				result.Members.Add(constructor);

				return result;
			}
			catch (Exception)
			{
				//File.AppendAllText(@"C:\temp\reinforced.log.txt", ex.ToString());

				return null;
			}
		}
	}
}