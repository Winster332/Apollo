using System.Reflection;
using System.Runtime.CompilerServices;

[assembly: InternalsVisibleTo("Apollo.Domain.Tests")]

namespace Apollo.Domain
{
	public static class AssemblyHelper
	{
		public static Assembly GetDomainAssembly() => typeof(AssemblyHelper).Assembly;
	}
}