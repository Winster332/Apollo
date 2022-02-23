using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Models
{
	[Keyless]
	[Table("PROTOCOL_A")]
	public class ActDto
	{
		[Column("KODZ", TypeName = "int, not null")]
		public int Id { get; set; }
		
		[Column("SOOB2", TypeName = "varchar(4000), null")]
		public string Message { get; set; }
		
		[Column("ADRESS2", TypeName = "varchar(200), null")]
		public string Address { get; set; }
		
		[Column("SYS_NAME2", TypeName = "varchar(4), null")]
		public string CategoryName { get; set; }
		
		[Column("TYPEZ2", TypeName = "varchar(30), null")]
		public string Type { get; set; }
		
		[Column("ORG_RAB2", TypeName = "int, null")]
		public int? OrganizationWorkId { get; set; }
		
		[Column("ORG_RAB_NAME2", TypeName = "varchar(70), null")]
		public string OrganizationWorkName { get; set; }
		
		[Column("BRIG2", TypeName = "varchar(100), null")]
		public string ForemanName { get; set; }
		
		[Column("DDTT_REM2", TypeName = "datetime, null")]
		public DateTime? Ddttrem { get; set; }
		
		[Column("TIME_REM2", TypeName = "varchar(32), null")]
		public string Time { get; set; }
		
		[Column("SOST2", TypeName = "varchar(32), null")]
		public string Status { get; set; }
		
		[Column("DDTT_AV2", TypeName = "datetime, null")]
		public DateTime? DateTimeAv2 { get; set; }
		
		[Column("MADE2", TypeName = "varchar(4000), null")]
		public string Made { get; set; }
		
		[Column("FIO_K2", TypeName = "varchar(50), null")]
		public string OrganizationName { get; set; }
		
		[Column("RASPO2", TypeName = "varchar(32), null")]
		public string Paspo { get; set; }
		
		[Column("PRSENDZ2", TypeName = "int, null")]
		public int? Presendz { get; set; }
		
		[Column("SROK2", TypeName = "datetime, null")]
		public DateTime? EstimateDateTime { get; set; }
		
		[Column("DDTT_PLAN2", TypeName = "datetime, null")]
		public DateTime? DateTimePlan { get; set; }
		
		[Column("IDDISP", TypeName = "int, null")]
		public int? DispatcherId { get; set; }
		
		[Column("DDTTIZM", TypeName = "datetime, null")]
		public DateTime? UpdatedDateTime { get; set; }
	}
}