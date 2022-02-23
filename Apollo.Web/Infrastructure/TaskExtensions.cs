using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace Apollo.Web.Infrastructure
{
	public static class TaskExtensions
	{
		public static async Task<ActionResult<T>> AsActionResult<T>(this Task<T> task) =>
			await task;
	}
}