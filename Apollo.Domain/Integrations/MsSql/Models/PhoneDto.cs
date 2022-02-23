using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Models
{
	[Keyless]
	[Table("PEOPLE_PHONES")]
	public partial class PhoneDto
	{
		// [ForeignKey()]
		// [Key]
		[Column("ID", TypeName = "int, not null")]
		public int Id { get; set; }
		
		[Column("KDOM", TypeName = "int, null")]
		public int? Kdom { get; set; }
		
		[Column("NFLAT1", TypeName = "smallint, null")]
		public short? Nflat1 { get; set; }
		
		[Column("KMAN", TypeName = "int, null")]
		public int? Kman { get; set; }
		
		[Column("FIO", TypeName = "varchar(90), null")]
		public string? Fio { get; set; }
		
		[Column("PHONES", TypeName = "varchar(50), null")]
		public string? Phones { get; set; }
		
		[Column("EMAIL", TypeName = "varchar(100), null")]
		public string? Email { get; set; }
		
		[Column("K_STAT", TypeName = "int, null")]
		public int? KStat { get; set; }
		
		[Column("STAT", TypeName = "varchar(50), null")]
		public string? Stat { get; set; }
		
		[Column("PRIMECH", TypeName = "varchar(500), null")]
		public string? Primech { get; set; }
	}
}