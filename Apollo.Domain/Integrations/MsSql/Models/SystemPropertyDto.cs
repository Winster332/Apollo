using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Models
{
	[Keyless]
	[Table("ALLSPR")]
	public class SystemPropertyDto
	{
		[Column("NGROUP", TypeName = "int, null")]
		public int Group { get; set; }
		
		[Column("KOD", TypeName = "int, null")]
		public int Id { get; set; }
		
		[Column("NAME", TypeName = "varchar(50), null")]
		public string Name { get; set; }
	}
}