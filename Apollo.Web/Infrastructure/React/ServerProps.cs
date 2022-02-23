using System;
using Apollo.Domain.Accounts.User;
using Apollo.Domain.Configuration;
using Apollo.Domain.SharedKernel;
using Functional.Maybe;

// ReSharper disable MemberCanBePrivate.Global
// ReSharper disable UnusedAutoPropertyAccessor.Global

namespace Apollo.Web.Infrastructure.React
{
	internal class ServerProps
	{
		public string AppName { get; }
		public object AppProps { get; }
		public UniverseState UniverseState { get; }
		public DateTime Now { get; }
		public string[] AdditionalScripts { get; }
		public bool ClientOnly { get; }
		public bool IsMobile { get; }
		public Maybe<UserView> UserView { get; }
		public QuantitativeCounter[] Counters { get; }

		public ServerProps(
			string appName,
			object appProps,
			UniverseState universeState,
			DateTime now,
			string[] additionalScripts,
			bool clientOnly,
			bool isMobile,
			Maybe<UserView> userView,
			QuantitativeCounter[] counters)
		{
			AppName = appName;
			AppProps = appProps;
			UniverseState = universeState;
			Now = now;
			AdditionalScripts = additionalScripts;
			ClientOnly = clientOnly;
			IsMobile = isMobile;
			UserView = userView;
			Counters = counters;
		}
	}
}