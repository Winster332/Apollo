using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Models
{
	[Keyless]
	[Table("SOB")]
	public class MessageDto
	{
		[Column("PRIZN", TypeName = "numeric(0,3), null")]
		public int? Prizn { get; set; }
		
		[Column("NUMUNIT", TypeName = "int, null")]
		public int? NumUnit { get; set; }
		
		[Column("NUMSOB", TypeName = "int, not null")]
		public int Id { get; set; }
		
		[Column("DDTT", TypeName = "datetime, null")]
		public DateTime? DateTime { get; set; }
		
		[Column("SYSTEM", TypeName = "smallint, null")]
		public short? System { get; set; }
		
		[Column("SYSNAME", TypeName = "varchar(4), null")]
		public string SysName { get; set; }
		
		[Column("TYPE", TypeName = "varchar(10), null")]
		public string Type { get; set; }
		
		[Column("ADRESS", TypeName = "varchar(100), null")]
		public string Address { get; set; }
		
		[Column("AVE_A", TypeName = "varchar(30), null")]
		public string AveA { get; set; }
		
		[Column("HOUSE_A", TypeName = "varchar(10), null")]
		public string HouseA { get; set; }
		
		[Column("KORPUS_A", TypeName = "varchar(4), null")]
		public string FrameA { get; set; }
		
		[Column("PAR_A", TypeName = "smallint, null")]
		public short? ParA { get; set; }
		
		[Column("FLAT_A", TypeName = "varchar(4), null")]
		public string FlatA { get; set; }
		
		[Column("DEFECT", TypeName = "varchar(70), null")]
		public string Defect { get; set; }
		
		[Column("PLACE", TypeName = "varchar(25), null")]
		public string Place { get; set; }
		
		[Column("DOPSVED", TypeName = "varchar(200), null")]
		public string Description { get; set; }
		
		[Column("ORGR1", TypeName = "int, null")]
		public int? OrganizationId { get; set; }
		
		[Column("SOU_NAME", TypeName = "varchar(20), null")]
		public string SouName { get; set; }
		
		[Column("KOL_OTKL", TypeName = "smallint, null")]
		public short? KolOtkl { get; set; }
		
		[Column("DDTT_LIKV", TypeName = "datetime, null")]
		public DateTime? DateTimeLikv { get; set; }
		
		[Column("DDTT_PLAN", TypeName = "datetime, null")]
		public DateTime? DateTimePlan { get; set; }
		
		[Column("DISP", TypeName = "varchar(15), null")]
		public string Disp { get; set; }
		
		[Column("FAMO", TypeName = "varchar(15), null")]
		public string Famo { get; set; }
		
		[Column("PODKL", TypeName = "bit, null")]
		public bool? Podkl { get; set; }
		
		[Column("NUMSOB_OLD", TypeName = "int, null")]
		public int? OldId { get; set; }
		
		[Column("KODDOM", TypeName = "int, null")]
		public int? HomeId { get; set; }
		
		[Column("NUZAVT", TypeName = "int, null")]
		public int? Nuzavt { get; set; }
		
		[Column("IDRECAVT", TypeName = "int, null")]
		public int? Idrecavt { get; set; }
		
		[Column("NCAVT", TypeName = "int, null")]
		public int? Ncavt { get; set; }
		
		[Column("NUZSEND", TypeName = "int, null")]
		public int? Nuzsend { get; set; }
		
		[Column("NCSEND", TypeName = "int, null")]
		public int? Ncsend { get; set; }
		
		[Column("IDTABLE", TypeName = "int, null")]
		public int? IdTable { get; set; }
		
		[Column("TYPECH", TypeName = "int, null")]
		public int? TypeCh { get; set; }
	}
}