using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Models
{
	[Keyless]
	[Table("STREET")]
	public class StreetDto
	{
		[Column("KRNA", TypeName = "smallint, null")]
		public short? Krna { get; set; }
		
		[Column("KRN", TypeName = "smallint, null")]
		public short? DistrictId { get; set; }
		
		[Column("KSTR", TypeName = "int, null")]
		public int? Id { get; set; }
		
		[Column("NAMESTR", TypeName = "varchar(24), null")]
		public string Name { get; set; }
		
		[Column("NAMESKOMZEM", TypeName = "varchar(80), null")]
		public string NameKomzem { get; set; }
		
		[Column("KKOMZEM", TypeName = "int, null")]
		public int? KeyKomZem { get; set; }
	}
}