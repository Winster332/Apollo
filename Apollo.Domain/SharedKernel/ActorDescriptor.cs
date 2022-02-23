using EventFlow.ValueObjects;

namespace Apollo.Domain.SharedKernel
{
	public class ActorDescriptor: ValueObject
	{
		public ActorDescriptor(string value, string name)
		{
			Value = value;
			Name = name;
		}

		public string Value { get; }
		public string Name { get; }
	}
}