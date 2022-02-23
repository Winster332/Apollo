using System;
using MoreLinq.Extensions;
using Reinforced.Typings;
using Reinforced.Typings.Ast;
using Reinforced.Typings.Ast.TypeNames;
using Reinforced.Typings.Attributes;
using Reinforced.Typings.Generators;

namespace Apollo.Web.Infrastructure.Typings
{
	public class SignalRHubProxyGenerator: ClassCodeGenerator
	{
		public override RtClass GenerateNode(Type controller, RtClass result,
			TypeResolver resolver)
		{
			result = base.GenerateNode(controller, result, resolver);

			if (result == null) return null;

			result.Extendee = new RtSimpleTypeName("SignalRHubBase");

			var constructor =
				new RtConstructor { Body = new($"super('{controller.GetHubPath()}')") };

			result.Members.Add(constructor);

			return result;
		}

		protected override void ExportMethods(
			ITypeMember typeMember,
			Type element,
			TypeResolver resolver,
			IAutoexportSwitchAttribute swtch) =>
			element.BaseType
				.GetGenericArguments()[0]
				.GetMethods()
				.ForEach(
					m => typeMember.Members.Add(Context.Generators.GeneratorFor(m)
						.Generate(m, resolver)));
	}
}