using System;
using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Infrastructure
{
	public static class MaybeExtensions
	{
		public static Maybe<ActionResult<TTo>> SelectResult<TFrom, TTo>(
			this Maybe<TFrom> maybe,
			Func<TFrom, TTo> selector) =>
			maybe.Select(m => new ActionResult<TTo>(selector(m)));
	}
}