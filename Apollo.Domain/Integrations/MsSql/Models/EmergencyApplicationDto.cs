using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Models
{
	[Keyless]
	[Table("AVARZ")]
	public class EmergencyApplicationDto
	{
		[Column("NUMUNIT", TypeName = "int, null")]
		public int? NumUnit { get; set; }
		
		[Column("KODZ", TypeName = "int, null")]
		public int? Id { get; set; }
		
		[Column("NUMZ", TypeName = "varchar(20), null")]
		public string Number { get; set; }
		
		[Column("NUMSOB", TypeName = "int, null")]
		public int? NumberSob { get; set; }
		
		[Column("PRIZN", TypeName = "smallint, null")]
		public short? Prizn { get; set; }
		
		[Column("DDTT", TypeName = "datetime, null")]
		public DateTime? DateTime { get; set; }
		
		[Column("AVE", TypeName = "varchar(50), null")]
		public string Address { get; set; }
		
		[Column("KODUL", TypeName = "int, null")]
		public int? Kodul { get; set; }
		
		[Column("HOUSE", TypeName = "varchar(10), null")]
		public string HouseNumber { get; set; }
		
		[Column("KORPUS", TypeName = "varchar(4), null")]
		public string FrameNumber { get; set; }
		
		[Column("REU", TypeName = "smallint, null")]
		public short? Reu { get; set; }
		
		[Column("PRINADL", TypeName = "int, null")]
		public int? Prinadl { get; set; }
		
		[Column("ORGAN", TypeName = "varchar(30), null")]
		public string Organ { get; set; }
		
		[Column("PAR", TypeName = "smallint, null")]
		public short? Par { get; set; }
		
		[Column("FLAT", TypeName = "varchar(4), null")]
		public string Flat { get; set; }
		
		[Column("ETAG", TypeName = "smallint, null")]
		public short? Etag { get; set; }
		
		[Column("FIO", TypeName = "varchar(50), null")]
		public string Fio { get; set; }
		
		[Column("TEL", TypeName = "varchar(50), null")]
		public string PhoneNumber { get; set; }
		
		[Column("PLACE", TypeName = "varchar(50), null")]
		public string Place { get; set; }
		
		[Column("DEFECT", TypeName = "varchar(50), null")]
		public string Defect { get; set; }
		
		[Column("SOOB", TypeName = "varchar(4000), null")]
		public string Message { get; set; }
		
		[Column("ADR_UT", TypeName = "varchar(100), null")]
		public string AdrUt { get; set; }
		
		[Column("SYSTEM", TypeName = "int, null")]
		public int? System { get; set; }
		
		[Column("SYS_NAME", TypeName = "varchar(4), null")]
		public string SysName { get; set; }
		
		[Column("TYPEZ", TypeName = "smallint, null")]
		public short? Type { get; set; }
		
		[Column("NGROUP", TypeName = "int, null")]
		public int? NGroup { get; set; }
		
		[Column("NORG", TypeName = "int, null")]
		public int? NOrg { get; set; }
		
		[Column("KODORG", TypeName = "int, null")]
		public int? OrgId { get; set; }
		
		[Column("ORG_RAB", TypeName = "int, null")]
		public int? OrgRab { get; set; }
		
		[Column("ORG_RAB004", TypeName = "int, null")]
		public int? OrgRab004 { get; set; }
		
		[Column("ORG_RAB_NAME", TypeName = "varchar(70), null")]
		public string OrgRabName { get; set; }
		
		[Column("BRIG", TypeName = "int, null")]
		public int? Brig { get; set; }
		
		[Column("DDTT_REM", TypeName = "datetime, null")]
		public DateTime? DateTimeRem { get; set; }
		
		[Column("TIME_REM", TypeName = "smallint, null")]
		public short? TimeRem { get; set; }
		
		[Column("DOP", TypeName = "varchar(50), null")]
		public string Dop { get; set; }
		
		[Column("DISP", TypeName = "varchar(50), null")]
		public string Disp { get; set; }
		
		[Column("SOST", TypeName = "smallint, null")]
		public short? Sost { get; set; }
		
		[Column("DDTT_AV", TypeName = "datetime, null")]
		public DateTime? DateTimeAv { get; set; }
		
		[Column("FIO_AV", TypeName = "varchar(50), null")]
		public string FioAv { get; set; }
		
		[Column("FIO_ISPOLN", TypeName = "varchar(50), null")]
		public string FioIspln { get; set; }
		
		[Column("MADE", TypeName = "varchar(4000), null")]
		public string Made { get; set; }
		
		[Column("SVARKA", TypeName = "smallint, null")]
		public short? Svarka { get; set; }
		
		[Column("FIO_K", TypeName = "varchar(50), null")]
		public string FioK { get; set; }
		
		[Column("DDTT_K", TypeName = "datetime, null")]
		public DateTime? DateTimeK { get; set; }
		
		[Column("FLA_SIZE", TypeName = "smallint, null")]
		public short? FlaSize { get; set; }
		
		[Column("STO_SIZE", TypeName = "smallint, null")]
		public short? StoSize { get; set; }
		
		[Column("KONTROL", TypeName = "bit, null")]
		public bool? Kontrol { get; set; }
		
		[Column("PODKL", TypeName = "bit, null")]
		public bool? Podkl { get; set; }
		
		[Column("ZGL", TypeName = "bit, null")]
		public bool? Zgl { get; set; }
		
		[Column("RASPO", TypeName = "smallint, null")]
		public short? Raspo { get; set; }
		
		[Column("VNUM", TypeName = "int, null")]
		public int? Vnum { get; set; }
		
		[Column("SROK", TypeName = "datetime, null")]
		public DateTime? Srok { get; set; }
		
		[Column("GRZ", TypeName = "varchar(50), null")]
		public string Grz { get; set; }
		
		[Column("ZTYPE", TypeName = "int, null")]
		public int? ZType { get; set; }
		
		[Column("ZTYPE_NAME", TypeName = "varchar(50), null")]
		public string ZTYpeName { get; set; }
		
		[Column("SVERKA", TypeName = "bit, null")]
		public bool? Sverka { get; set; }
		
		[Column("FIODOP", TypeName = "varchar(50), null")]
		public string FioDop { get; set; }
		
		[Column("TELDOP", TypeName = "varchar(50), null")]
		public string TelDop { get; set; }
		
		[Column("POVTPR", TypeName = "int, null")]
		public int Povtpr { get; set; }
		
		[Column("POVTDATE", TypeName = "datetime, null")]
		public DateTime? PovtDate { get; set; }
		
		[Column("POVTDOP", TypeName = "varchar(100), null")]
		public string PovtDop { get; set; }
		
		[Column("OTCHINST", TypeName = "varchar(50), null")]
		public string Otchinst { get; set; }
		
		[Column("DISPIN", TypeName = "varchar(50), null")]
		public string Dispin { get; set; }
		
		[Column("KOMMENT", TypeName = "varchar(4000), null")]
		public string Comment { get; set; }
		
		[Column("WAVFILE", TypeName = "varchar(50), null")]
		public string WaveFile { get; set; }
		
		[Column("DDTT_FIRST", TypeName = "datetime, null")]
		public DateTime? DateTimeFirst { get; set; }
		
		[Column("DDTT_PLAN", TypeName = "datetime, null")]
		public DateTime? DateTimePlan { get; set; }
		
		[Column("DDTT_PRKO", TypeName = "datetime, null")]
		public DateTime? DateTimePrko { get; set; }
		
		[Column("PRZAJAVK", TypeName = "varchar(100), null")]
		public string Przajavk { get; set; }
		
		[Column("DDTT_SEND", TypeName = "datetime, null")]
		public DateTime? DateTimeSend { get; set; }
		
		[Column("EVENT_PK", TypeName = "int, null")]
		public int? EventPk { get; set; }
		
		[Column("MADE_OLD", TypeName = "varchar(4000), null")]
		public string MadeOld { get; set; }
		
		[Column("DDTT_UPDATE", TypeName = "datetime, null")]
		public DateTime? DateTimeUpdate { get; set; }
		
		[Column("NUZAVT", TypeName = "int, null")]
		public int? Nuzavt { get; set; }
		
		[Column("IDRECAVT", TypeName = "int, null")]
		public int? Idrecavt { get; set; }
		
		[Column("NCAVT", TypeName = "int, null")]
		public int? NCavt { get; set; }
		
		[Column("NUZSEND", TypeName = "int, null")]
		public int? Nuzsend { get; set; }
		
		[Column("NCSEND", TypeName = "int, null")]
		public int? Ncsend { get; set; }
		
		[Column("NUZISP", TypeName = "int, null")]
		public int? Nuzisp { get; set; }
		
		[Column("PRSENDZ", TypeName = "int, null")]
		public int? Prsendz { get; set; }
		
		[Column("IDTABLE", TypeName = "int, null")]
		public int? IdTable { get; set; }
		
		[Column("TYPECH", TypeName = "int, null")]
		public int? TypeCh { get; set; }
		
		[Column("ID_ORG_004", TypeName = "varchar(20), null")]
		public string IdOrg004 { get; set; }
		
		[Column("VNUMSTR", TypeName = "varchar(20), null")]
		public string VNumstr { get; set; }
		
		[Column("FALSE_Z", TypeName = "int, null")]
		public int? FalseZ { get; set; }
		
		[Column("DELAY_Z", TypeName = "int, null")]
		public int? DelayZ { get; set; }
		
		[Column("BAD_CALL_Z", TypeName = "int, null")]
		public int? BadCallZ { get; set; }
		
		[Column("WORK_INF_Z", TypeName = "int, null")]
		public int? WorkInfZ { get; set; }
		
		[Column("SECTOR_CONTROL", TypeName = "bit, null")]
		public bool? SectorControl { get; set; }
		
		[Column("SOOB_004", TypeName = "varchar(1000), null")]
		public string Soob004 { get; set; }
		
		[Column("DT_SOOB_004", TypeName = "datetime, null")]
		public DateTime? DateTimeSoob004 { get; set; }
		
		[Column("DT_SOOB_ADS", TypeName = "datetime, null")]
		public DateTime? DateTimeSoobAds { get; set; }
		
		[Column("DDTT_ISP", TypeName = "datetime, null")]
		public DateTime? DateTimeIsp { get; set; }
		
		[Column("DDTT_IIZ", TypeName = "datetime, null")]
		public DateTime? DateTimeIIZ { get; set; }
		
		[Column("DDTT_ZZI", TypeName = "datetime, null")]
		public DateTime? DateTimeZZI { get; set; }
	}
}