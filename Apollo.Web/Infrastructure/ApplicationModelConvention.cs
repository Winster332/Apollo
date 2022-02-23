using System;
using System.Linq;
using System.Reflection;
using Apollo.Web.Applications;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ActionConstraints;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using MoreLinq.Extensions;

namespace Apollo.Web.Infrastructure
{
	/// <summary>
	/// Заведует всей моделью приложения —
	/// 1) Назначает каждому экшну контроллера атрибут роутинга к нему по умолчанию + добавляет особенные роуты по таблице.
	/// 2) Настраивает биндинг-моделей внутри API
	/// 3) Настраивает работу всех экшнов внутри API по POST, если не указано иное
	/// </summary>
	public class ApplicationModelConvention: IApplicationModelConvention
	{
		private static readonly RouteTable CustomRoutes = new(new[]
		{
			new CustomRouteDescriptor(
				typeof(ApplicationController),
				nameof(ApplicationController.List),
				"/")
		});

		public void Apply(ApplicationModel application) =>
			application.Controllers.ForEach(SetupRoutingForController);

		private void SetupRoutingForController(ControllerModel controller)
		{
			var cleanedControllerName =
				controller.ControllerType.Name.Replace("Controller", "");

			var isApi = _baseApiControllerType.IsAssignableFrom(controller.ControllerType);

			var ownControllerPrefix =
				new AttributeRouteModel(new RouteAttribute(cleanedControllerName));

			var controllerPrefix =
				isApi
					? AttributeRouteModel.CombineAttributeRouteModel(_apiPrefix,
						ownControllerPrefix)
					: ownControllerPrefix;

			controller.Actions.ForEach(action =>
				SetupRoutingForAction(action, isApi, controllerPrefix,
					controller.ControllerType));
		}

		private void SetupRoutingForAction(ActionModel action, bool isApi,
			AttributeRouteModel controllerPrefix, TypeInfo controllerType)
		{
			var actionNameRoute =
				new AttributeRouteModel(new RouteAttribute(action.ActionName));

			var selector = action.Selectors.First();

			selector.AttributeRouteModel =
				AttributeRouteModel.CombineAttributeRouteModel(controllerPrefix,
					actionNameRoute);

			// Если не указано явно иначе, все методы API доступны только по POST'у
			if (isApi && selector.ActionConstraints.All(con =>
				con.GetType() != typeof(HttpMethodActionConstraint)))
				selector.ActionConstraints.Add(
					new HttpMethodActionConstraint(new[] { "POST" }));

			CustomRoutes
				.Find(controllerType, action.ActionName)
				.ForEach(route =>
					action.Selectors.Add(new() { AttributeRouteModel = route.Route }));

			if (isApi)
				action
					.Parameters
					.Where(param =>
						TypesHelper.IsClientServerContractType(param.ParameterType)
						&& NoAttribute(param.ParameterType, typeof(UseDefaultBinderAttribute)))
					.ForEach(param => {
						param.BindingInfo = new()
						{
							BinderModelName = param.ParameterName,
							BindingSource = BindingSource.Body,
							BinderType = typeof(ApiContractsModelBinder)
						};
					});
		}

		private static bool NoAttribute(Type input, Type attributeType) =>
			input.GetCustomAttributes(attributeType, true).Length == 0;

		private readonly AttributeRouteModel _apiPrefix = new(new RouteAttribute("api"));

		private readonly Type _baseApiControllerType = typeof(BaseApiController);
	}

	/// <summary>
	/// Описывает роут, который ведёт к некоторому экшну контроллера по нестандартному пути.
	/// </summary>
	internal class CustomRouteDescriptor
	{
		/// <summary>
		/// </summary>
		/// <param name="controllerType">typeof(Контроллер)</param>
		/// <param name="actionName">nameof(Контроллер.Экшн)</param>
		/// <param name="route">Роут к экшну в стандартных терминах ASP.NET Core MVC'шного роутинга.</param>
		public CustomRouteDescriptor(Type controllerType, string actionName, string route)
		{
			ControllerType = controllerType;
			ActionName = actionName;
			Route = new(new RouteAttribute(route));
		}

		public Type ControllerType { get; }

		public string ActionName { get; }

		public AttributeRouteModel Route { get; }
	}

	internal class RouteTable
	{
		private readonly CustomRouteDescriptor[] _descriptors;

		public RouteTable(CustomRouteDescriptor[] descriptors) => _descriptors = descriptors;

		public CustomRouteDescriptor[] Find(Type controllerType, string actionName) =>
			_descriptors
				.Where(d =>
					d.ControllerType == controllerType
					&& d.ActionName == actionName)
				.ToArray();
	}
}