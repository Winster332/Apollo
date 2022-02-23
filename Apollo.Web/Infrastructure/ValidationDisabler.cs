using Functional.Maybe;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;
using Microsoft.Extensions.DependencyInjection;

namespace Apollo.Web.Infrastructure
{
	public static class ValidationDisabler
	{
		public static IServiceCollection DisableDefaultModelValidation(
			this IServiceCollection services)
		{
			services.FirstMaybe(s => s.ServiceType == typeof(IObjectModelValidator))
				.Do(serviceDescriptor => {
					services.Remove(serviceDescriptor);

					services.Add(new(typeof(IObjectModelValidator),
						_ => new EmptyModelValidator(),
						ServiceLifetime.Singleton
					));
				});

			return services;
		}


		private class EmptyModelValidator: IObjectModelValidator
		{
			public void Validate(ActionContext actionContext,
				ValidationStateDictionary validationState, string prefix, object model) { }
		}
	}
}