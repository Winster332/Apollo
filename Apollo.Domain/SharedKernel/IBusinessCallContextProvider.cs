using System.Threading.Tasks;

namespace Apollo.Domain.SharedKernel
{
	public interface IBusinessCallContextProvider
	{
		Task<BusinessCallContext> GetCurrent();
	}
}