using System.Collections.Generic;
using System.Reflection;

namespace Apollo.Web.Infrastructure.Typings
{
	public class PropertyEqualityComparer: IEqualityComparer<PropertyInfo>
	{
		private PropertyEqualityComparer() { }

		public bool Equals(PropertyInfo x, PropertyInfo y) => x.Name == y.Name;

		public int GetHashCode(PropertyInfo obj) => 0;

		public static readonly PropertyEqualityComparer Instance = new();
	}
}