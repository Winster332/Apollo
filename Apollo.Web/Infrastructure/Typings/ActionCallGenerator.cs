using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Mvc;
using MoreLinq.Extensions;
using Reinforced.Typings;
using Reinforced.Typings.Ast;
using Reinforced.Typings.Generators;

namespace Apollo.Web.Infrastructure.Typings
{
	[UsedImplicitly]
	public class ActionCallGenerator: MethodCodeGenerator
	{
		public override RtFunction GenerateNode(MethodInfo action, RtFunction result,
			TypeResolver resolver)
		{
			try
			{
				result = base.GenerateNode(action, result, resolver);

				if (result == null) return null;

				if (action.GetCustomAttributes().Any(att =>
					att.GetType() == typeof(PreventTypingsCreationAttribute)))
					return null;

				var args = ListArguments(action, result);

				// ReSharper disable once PossibleNullReferenceException
				var controller = action.DeclaringType.Name.Replace("Controller", "");
				var path = $"/api/{controller}/{action.Name}";

				var useJson = args.Select(x => x.Server.ParameterType)
					.Any(TypesHelper.IsClientServerContractType);

				var returnType = resolver.ResolveTypeName(UnwrapType(action.ReturnType));

				result.Body = useJson
					? new(
						$@"const params = {DataParametersAsString(args, true)};
return this.http.post('{path}', params)
	.then((response: {{ data: any }}) => {{ return fromServer(response.data) as {returnType}; }});"
					)
					: new RtRaw(
						$@"const params = {DataParametersAsString(args, false)};
return this.http.post(`{path}?${{params}}`, {{}})
	.then((response: {{ data: any }}) => {{ return fromServer(response.data) as {returnType}; }});"
					);

				return result;
			}
			catch (Exception)
			{
				//File.AppendAllText(@"C:\temp\reinforced.log.txt", ex.ToString());

				return null;
			}
		}

		private static Type UnwrapType(Type serverType)
		{
			if (!serverType.IsGenericType) return serverType;

			var typeDefinition = serverType.GetGenericTypeDefinition();

			return typeDefinition == typeof(Task<>)
			       || typeDefinition == typeof(ActionResult<>)
				? UnwrapType(serverType.GetGenericArguments().Single())
				: serverType;
		}

		private string DataParametersAsString(Arg[] args, bool useJson)
		{
			var preparedAsStrings = args.ToDictionary(x => x.Client.Identifier,
				x => ClientServerTransform(x.Client, x.Server, useJson));

			return useJson
				? AsJson(preparedAsStrings)
				: AsQueryString(preparedAsStrings);
		}

		private static string AsJson(Dictionary<RtIdentifier, string> preparedAsStrings)
		{
			var ps = preparedAsStrings.Select(x => $"'{x.Key}': {x.Value}");

			return $@"{{ {string.Join(", ", ps)} }}";
		}

		private static string AsQueryString(Dictionary<RtIdentifier, string> preparedAsStrings)
		{
			var ps = preparedAsStrings.Select(x => $"{x.Key}=${{{x.Value}}}");

			return $@"`{string.Join("&", ps)}`";
		}


		private static string ClientServerTransform(RtArgument clientArg,
			ParameterInfo serverArg, bool useJson)
		{
			var simple = new[]
			{
				typeof(string), typeof(Guid), typeof(string), typeof(Maybe<string>),
				typeof(Maybe<Guid>)
			};

			if (simple.Contains(serverArg.ParameterType))
				return $"encodeURIComponent({clientArg.Identifier})";

			var dts = new[] { typeof(Date), typeof(Maybe<Date>) };

			if (!useJson && dts.Contains(serverArg.ParameterType))
				return $"fromClient({clientArg.Identifier}).__dt";

			return $"fromClient({clientArg.Identifier})";
		}

		private Arg[] ListArguments(MethodInfo action, RtFunction result) =>
			result.Arguments.EquiZip(action.GetParameters(),
					(client, server) => new Arg(client, server))
				.ToArray();

		private class Arg
		{
			public Arg(RtArgument client, ParameterInfo server)
			{
				Client = client;
				Server = server;
			}

			public RtArgument Client { get; }
			public ParameterInfo Server { get; }
		}
	}
}