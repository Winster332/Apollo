using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Models
{
	[Keyless]
	[Table("PEOPLE")]
	public class PersonDto
	{
		[Column("FIRSTNAME", TypeName = "varchar(50), null")]
		public int? HomeId { get; set; }
		
		[Column("LASTNAME", TypeName = "varchar(50), null")]
		public int? NumberHome { get; set; }
		
		[Column("BIRTHDAY", TypeName = "datetime, null")]
		public int? Frame { get; set; }
		
		[Column("LGOTS", TypeName = "varchar(50), null")]
		public int? NumberRoom { get; set; }
		
		[Column("POL", TypeName = "int, null")]
		public int? Sex { get; set; }
		
		[Column("TO", TypeName = "int, null")]
		public int? To { get; set; }
	}
}