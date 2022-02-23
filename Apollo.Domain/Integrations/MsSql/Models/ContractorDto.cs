using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql.Models
{
	[Keyless]
	[Table("TREEORG")]
	public class ContractorDto
	{
		[Column("KODORG", TypeName = "int, null")]
		public int? Id { get; set; }// [AVARZ].Org_RAB
		
		[Column("KOD", TypeName = "int, null")]
		public int? Uid { get; set; }
		
		[Column("NAME", TypeName = "varchar(70), null")]
		public string Name { get; set; }
		
		[Column("KODGR", TypeName = "int, null")]
		public int? Kodrg { get; set; }

		[Column("NUMBER", TypeName = "int, null")]
		public int? Number { get; set; }
	}
}