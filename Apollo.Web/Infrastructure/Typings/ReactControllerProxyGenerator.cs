using System;
using JetBrains.Annotations;
using Reinforced.Typings;
using Reinforced.Typings.Ast;
using Reinforced.Typings.Generators;

namespace Apollo.Web.Infrastructure.Typings
{
	[UsedImplicitly]
	public class ReactControllerProxyGenerator: ClassCodeGenerator
	{
		public override RtClass GenerateNode(Type controller, RtClass result,
			TypeResolver resolver)
		{
			try
			{
				result = base.GenerateNode(controller, result, resolver);

				if (result == null) return null;

				result.Documentation = new()
				{
					Description = "Result of ReactControllerProxyGenerator activity"
				};

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