using System;
using System.Collections.Generic;

namespace Apollo.Web.Infrastructure.Typings
{
	internal struct SpecialTypesCategory
	{
		public SpecialTypesCategory(SpecialTypeGroup group)
		{
			Types = new();
			Group = group;
		}

		public void Deconstruct(out List<Type> types, out SpecialTypeGroup group)
		{
			types = Types;
			group = Group;
		}

		public void Add(Type type) => Types.Add(type);

		public bool Contains(Type type) => Types.Contains(type);

		public IReadOnlyCollection<Type> RegisteredTypes => Types;

		private List<Type> Types { get; }

		private SpecialTypeGroup Group { get; }
	}
}