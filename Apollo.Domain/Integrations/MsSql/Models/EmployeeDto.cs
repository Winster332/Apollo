using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Models
{
	[Keyless]
	[Table("EMPLOYES")]
	public class EmployeeDto
	{
		[Column("NUMBER", TypeName = "int, not null")]
		public int Number { get; set; }
		
		[Column("NAME", TypeName = "varchar(70), null")]
		public string Name { get; set; }
		
		[Column("PASSWORD", TypeName = "varchar(50), null")]
		public string Password { get; set; }
		
		[Column("ACCESS", TypeName = "int, null")]
		public int? Access { get; set; }
		
		[Column("ARH", TypeName = "int, null")]
		public int? Arh { get; set; }
	}
}