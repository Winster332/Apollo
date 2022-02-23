using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Models
{
	[Keyless]
	[Table("SPRORG")]
	public class OrganizationDto
	{
		[Column("KODORG", TypeName = "int, null")]
		public int? Id { get; set; }
		
		[Column("NAMEORG", TypeName = "varchar(70), null")]
		public string Name { get; set; }
		
		[Column("TYPEORG", TypeName = "varchar(10), null")]
		public string Type { get; set; }
		
		[Column("PHONES", TypeName = "varchar(100), null")]
		public string Phones { get; set; }
		
		[Column("NAMEORGLONG", TypeName = "varchar(150), null")]
		public string LongName { get; set; }
		
		[Column("NAMESVOD", TypeName = "varchar(10), null")]
		public string ShortName { get; set; }
	}
}