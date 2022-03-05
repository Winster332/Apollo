using System;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Models
{
	[Keyless]
	[Table("PEOPLE")]
	public class PeopleDto
	{
		[Column("KDOM", TypeName = "numeric(9,0), null")]
		public int? HomeId { get; set; }
		
		[Column("NDOM1", TypeName = "numeric(5,0), null")]
		public int? NumberHome { get; set; }
		
		[Column("KORP", TypeName = "varchar(5), null")]
		public int? Frame { get; set; }
		
		[Column("NKV1", TypeName = "numeric(5,0), null")]
		public int? NumberRoom { get; set; }
		
		[Column("KNANIM", TypeName = "numeric(9,0), null")]
		public int? KeyNanim { get; set; }
		
		[Column("KMAN", TypeName = "numeric(9,0), null")]
		public int? KeyMan { get; set; }
		
		[Column("FIO", TypeName = "varchar(90), null")]
		public string Fio { get; set; }
		
		[Column("NAMESTR", TypeName = "varchar(24), null")]
		public string StreetName { get; set; }
	}
}