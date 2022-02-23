using System.Linq;
using System.Reflection;
using Reinforced.Typings;
using Reinforced.Typings.Ast;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Generators;

namespace Apollo.Web.Infrastructure.Typings
{
	public class SubscribeToSignalRMessagesMethodGenerator: MethodCodeGenerator
	{
		public override RtFunction GenerateNode(MethodInfo element, RtFunction result,
			TypeResolver resolver)
		{
			result = base.GenerateNode(element, result, resolver);

			var baseArgument = result.Arguments.First();

			var funcArgument = new RtArgument
			{
				Identifier = new("callback"),
				Type = new RtDelegateType(
					new[]
					{
						new RtArgument
						{
							Identifier = new("message"), Type = baseArgument.Type
						}
					},
					new RtSimpleTypeName("void")
				)
			};

			result.Arguments.Clear();
			result.Arguments.Add(funcArgument);

			result.Body =
				new($"this.subscribe('{result.Identifier.IdentifierName}', callback);");

			return result;
		}
	}
}