using System;
using System.Collections.Generic;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using Apollo.Domain.EDS.Addresses;
using Apollo.Domain.Extensions;
using Apollo.Domain.SharedKernel;
using Apollo.Domain.Spreadsheets;
using EventFlow;
using EventFlow.Queries;
using EventFlow.ValueObjects;
using Functional.Maybe;

namespace Apollo.Domain.EDS.Organizations
{
	public class OrganizationImportService
	{
		public static async Task<ExecutionResult<IReadOnlyCollection<OrganizationImportItem>>> GetPreImportOrganizationesAsync(
			IQueryProcessor queryProcessor,
			IReadOnlyCollection<OrganizationExternal> organizationExternals)
		{
			try
			{
				var organizationViews = await queryProcessor.ProcessAsync(new ListOrganizationsQuery(), CancellationToken.None);
				var organizationesPreImport = new List<OrganizationImportItem>();
				
				foreach (var organizationExternal in organizationExternals)
				{
					var organizationInternal = FindInternalOrganization(organizationViews, organizationExternal);
					
					
					var item = new OrganizationImportItem(organizationExternal, organizationInternal);
					organizationesPreImport.Add(item);
				}

				return organizationesPreImport
					.ToReadOnly()
					.AsSuccess();
			}
			catch (Exception)
			{
				return ExecutionResult<IReadOnlyCollection<OrganizationImportItem>>.Failure("Ошибка при импорте");
			}

			Maybe<OrganizationView> FindInternalOrganization(IReadOnlyCollection<OrganizationView> internals, OrganizationExternal external)
				=> external.Organization
					.Select(org => internals.FirstMaybe(o => o.Name.ToLower() == org.ToLower()))
					.Collapse();
		}

		public static ExecutionResult<IReadOnlyCollection<OrganizationExternal>> ParseFromExcelFile(Stream fileStream)
		{
			Maybe<string> ClearCell(Maybe<string> v) => v.Where(v => !string.IsNullOrEmpty(v) && !string.IsNullOrWhiteSpace(v));
			try
			{
				var organizationExternals = new List<OrganizationExternal>();
				var workbook = Workbook.FromFile(fileStream);
				var readMode = false;

				workbook.Sheets.FirstMaybe().Do(x =>
				{
					var sheet = x.Value;

					foreach (var row in sheet)
					{
						var street = ClearCell(row[0]);
						var home = ClearCell(row[1]);
						var frame = ClearCell(row[2]);
						var litter = ClearCell(row[3]);
						var organization = ClearCell(row[4]);

						if (!readMode)
						{
							if (street.OrElseDefault() == "Улица" &&
							    home.OrElseDefault() == "Дом" &&
							    frame.OrElseDefault() == "Корпус" &&
							    litter.OrElseDefault() == "Литера" &&
							    organization.OrElseDefault() == "Обслуживает")
							{
								readMode = true;
							}
							continue;
						}

						organizationExternals.Add(new OrganizationExternal(
							organization,
							new AddressExternal(
								street,
								home,
								frame,
								litter
							)
						));
					}
				});
				
				return organizationExternals.ToReadOnly().AsSuccess();
			}
			catch (Exception)
			{
				return ExecutionResult<IReadOnlyCollection<OrganizationExternal>>.Failure("Не удалось разобрать данные из файла");
			}
		}

		public static async Task<ExecutionResult<int>> CommitImport(ICommandBus bus, IReadOnlyCollection<OrganizationExternal> Organizationes)
		{
			var updatedOrganizationIds = new List<ExecutionResult<OrganizationId>>();
			
			// foreach (var organizationExternal in Organizationes)
			// {
			// 	if (!organizationExternal.Value.IsSomething() || !organizationExternal.CorrelateId.IsSomething()) continue;
			// 	
			// 	var value = organizationExternal.Value.Value;
			// 	var correlateId = organizationExternal.CorrelateId.Value;
			//
			// 	updatedOrganizationIds.Add(await bus.PublishAsync(
			// 		new UpdateOrganizationCommand(Maybe<OrganizationId>.Nothing, value)
			// 	));
			// }
			//
			// if (updatedOrganizationIds.Any(c => c.Error.IsSomething()))
			// {
			// 	return ExecutionResult<int>.Failure($"Не удалось загрузить {updatedOrganizationIds.Where(c => !c.IsSuccess)} организация");
			// }
			
			return ExecutionResult<int>.Success(updatedOrganizationIds.Count);
		}
	}
	
	public class OrganizationImportItem : ValueObject
	{
		public OrganizationExternal External { get; private set; }
		public Maybe<OrganizationView> Internal { get; private set; }
		
		public OrganizationImportItem(OrganizationExternal external, Maybe<OrganizationView> @internal)
		{
			External = external;
			Internal = @internal;
		}
	}
	
	public class OrganizationExternal
	{
		public Maybe<string> Organization { get; private set; }
		public AddressExternal Address { get; private set; }

		public OrganizationExternal(Maybe<string> organization, AddressExternal address)
		{
			Organization = organization;
			Address = address;
		}
	}
}