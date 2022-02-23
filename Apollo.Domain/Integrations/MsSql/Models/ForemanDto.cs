using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Models
{
	[Keyless]
	[Table("BRIGSPR")]
	public class ForemanDto
	{
		[Column("NUZAVT", TypeName = "int, null")]
		public int? Node { get; set; }
		
		[Column("KODBRIG", TypeName = "int, not null")]
		public int? Id { get; set; }
		
		[Column("NAMEBRIG", TypeName = "varchar(100), null")]
		public string Name { get; set; }
		
		[Column("ORGR", TypeName = "int, null")]
		public int? OrganizationId { get; set; }
		
		[Column("ARH", TypeName = "bit, null")]
		public bool? Archive { get; set; }
		
		[Column("ID", TypeName = "int, not null")]
		public int? UniqId { get; set; }
		
		[Column("SYSTEM", TypeName = "varchar(100), null")]
		public string System { get; set; }
	}
}