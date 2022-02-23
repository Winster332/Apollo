using System.Runtime.CompilerServices;

namespace Apollo.Domain.SharedKernel
{
	public class Error
	{
		private Error(string description, string fileName, string methodName, int lineNumber)
		{
			Description = description;
			FileName = fileName;
			MethodName = methodName;
			LineNumber = lineNumber;
		}

		public string Description { get; }

		public string FileName { get; }

		public string MethodName { get; }

		public int LineNumber { get; }

		public static Error Create(
			string description,
			[CallerMemberName] string methodName = default,
			[CallerFilePath] string callerFilePath = default,
			[CallerLineNumber] int callerLineNumber = default) =>
			new(
				description,
				callerFilePath ?? string.Empty,
				methodName ?? string.Empty,
				callerLineNumber);
	}
}