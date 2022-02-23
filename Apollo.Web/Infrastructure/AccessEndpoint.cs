using System;

namespace Apollo.Web.Infrastructure
{
	[AttributeUsage(AttributeTargets.Method)]
	public class AccessEndpoint : Attribute
	{
		public string AccessId { get; }
		public AccessEndpoint(string accessId)
		{
			AccessId = accessId;
		}
	}
}