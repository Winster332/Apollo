import { Collections } from '@Shared/Collections';
import {
	AccountController,
	AddressController, ApplicationCategoryController,
	ApplicationController,
	CounterNames,
	EmployeeController, IntegrationController,
	OrganizationController, PeopleController, ReportController,
	RoleController,
	UsersController
} from '@Shared/Contracts';
import { Route } from '@Shared/LocationDescriptor';

import { action, computed, makeObservable, observable } from 'mobx';
import { AppNames } from '../AppNames';

import { CommonStore } from './CommonStore';
import DayjsUtils from "@date-io/dayjs";

class RouteGroup<T extends AppNames> {
	constructor(
		public readonly title: string,
		public readonly visible: boolean,
		...links: Route<T>[]) {
		this.links = links;
	}

	public links: Route<T>[];
}

class Routes<T extends AppNames> {
	constructor(
		...routeGroups: RouteGroup<T>[]
	) {
		this.routeGroups = routeGroups;
	}

	public routeGroups: RouteGroup<T>[];

	public check = (input: T) => {
		// noinspection RedundantConditionalExpressionJS
		return input ? true : false;
	};

	public allowedRouteGroups(accesses: string[]) {
		return this.routeGroups
			.map(g => ({
				visible: g.visible,
				title: g.title,
				links: this.checkGroupByAccesses(g, accesses)
			}))
			.filter(g => g.links.length > 0);
	}

	private checkGroupByAccesses = (group: RouteGroup<T>, accesses: string[]) => {
		return group.links.filter(l => accesses.filter(access => access === l.to.access).length !== 0);
	};
}

export class RouteTable {
	constructor(private store: CommonStore) {
		makeObservable(this);
	}

	@observable
	private expandedGroupTitles: string[] = [];

	@observable
	public sidebarOpen = false;

	@action
	public toggleGroup = (groupTitle: string) => this.expandedGroupTitles.includes(groupTitle)
		? this.expandedGroupTitles = this.expandedGroupTitles.filter(gt => gt !== groupTitle)
		: this.expandedGroupTitles.push(groupTitle);

	@computed
	public get routes() {
		const result = new Routes(
			new RouteGroup(
				'Основное',
				true,
				ApplicationController.list()
					.route('Заявки', true)
					.useCounter(CounterNames.ApplicationsList),
				AddressController.list(25)
					.route('Адреса', true)
					.useCounter(CounterNames.AddressesList),
				OrganizationController.list()
					.route('Организации', true)
					.useCounter(CounterNames.OrganizationsList),
				PeopleController.list(25, true)
					.route('Обратившиеся', true)
					.useCounter(CounterNames.Peoples),
				PeopleController.people('')
					.route('Человек', false),
			),
			new RouteGroup(
				'Отчеты',
				true,
				ReportController.fromAds()
					.route('АДС', true),
				ReportController.byOrganizations(new DayjsUtils().date().year())
					.route('По организациям', true),
				ReportController.fromSite()
					.route('Сайт', false),
				ReportController.differenceList()
					.route('Разница', true),
				ReportController.differenceReport('')
					.route('Разница', false),
			),
			new RouteGroup(
				'Настройки',
				true,
				UsersController.list()
					.route('Доступы', true)
					.useCounter(CounterNames.UsersList),
				RoleController.list()
					.route('Роли', true)
					.useCounter(CounterNames.Roles),
				EmployeeController.list('')
					.route('Сотрудники', true)
					.useCounter(CounterNames.EmployeesList),
				ApplicationCategoryController.list()
					.route('Категории', true)
					.useCounter(CounterNames.ApplicationCategoriesList),
				IntegrationController.list()
					.route('Интеграции', true),
				RoleController.role('')
					.route('Роль', false),
			),
			new RouteGroup(
				'Скрыто',
				true,
				AccountController.login()
					.route('Форма входа', false)
					.withoutLayout(),
				// __NEW_MENU_GENERATE_HERE__
			)
		);

		// Используется только для того, чтобы на уровне системы типов убедиться, что в роутах обозначены все возможные приложения
		// eslint-disable-next-line no-unused-expressions
		(false as true) && this.routes.check('' as AppNames);

		return result;
	}
	@computed
	public get menuSchema() {
		const store = this.store;
		const accesses = store.user?.accesses || [];
		return this.routes
			.allowedRouteGroups(accesses)
			.filter(x => x.links.filter(l => l.show).length > 0)
			.map(x => ({
				...x,
				expanded: this.expandedGroupTitles.includes(x.title),
				links: x.links.map(l => ({
					...l,
					active: l.to.appName === store.currentAppName
				}))
			}))
			.map(x => ({
				...x,
				active: x.links.filter(l => l.active).length > 0
			}));
	}

	@computed
	public get currentRoute() {
		return Collections
			.chain(this.routes.routeGroups.slice())
			.flatMap(r => r.links)
			.filter(r => r.to.appName === this.store.currentAppName)
			.first();
	}
}