using System.Threading.Tasks;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;

namespace Apollo.Domain.Tests
{
	internal class SystemContextProvider: IBusinessCallContextProvider
	{
		public Task<BusinessCallContext> GetCurrent() =>
			BusinessCallContext.System().AsTaskResult();
	}
}