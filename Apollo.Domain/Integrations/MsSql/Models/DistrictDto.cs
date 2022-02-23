using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Models
{
	[Keyless]
	[Table("SPRRN")]
	public class DistrictDto
	{
		[Column("KOD", TypeName = "int, null")]
		public int? Id { get; set; }
		
		[Column("TXT", TypeName = "varchar(55), null")]
		public string Name { get; set; }
	}
}