using System.Collections.Generic;
using EventFlow.ValueObjects;
using Functional.Maybe;

namespace Apollo.Domain.Integrations
{
	public class IntegrationResultField: ValueObject
	{
		public string Field { get; private set; }
		public object Value { get; private set; }

		public IntegrationResultField(string field, object value)
		{
			Field = field;
			Value = value;
		}
	}
	
	public class IntegrationResult : ValueObject
	{
		public IReadOnlyCollection<IntegrationResultField> Fields { get; private set; }
		public Maybe<string> Error { get; private set; }

		public IntegrationResult(IReadOnlyCollection<IntegrationResultField> fields, Maybe<string> error)
		{
			Fields = fields;
			Error = error;
		}
	}
}