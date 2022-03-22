using Apollo.Domain.Integrations.MsSql.Models;
using Microsoft.EntityFrameworkCore;

namespace Apollo.Domain.Integrations.MsSql
{
	public partial class AdsDbContext : DbContext
	{
		private string _connectionString;
		public virtual DbSet<PhoneDto> Phones { get; set; }
		public virtual DbSet<EmployeeDto> Employees { get; set; }
		public virtual DbSet<SystemPropertyDto> SystemProperties { get; set; }
		public virtual DbSet<PeopleDto> Peoples { get; set; }
		public virtual DbSet<ActDto> Acts { get; set; }
		public virtual DbSet<MessageDto> Messages { get; set; }
		public virtual DbSet<DistrictDto> Districts { get; set; }
		public virtual DbSet<ForemanDto> Foremans { get; set; }
		public virtual DbSet<ContractorDto> Contractors { get; set; }
		// public virtual DbSet<ApplicationTypeDto> ApplicationTypes { get; set; }
		public virtual DbSet<StreetDto> Streets { get; set; }
		public virtual DbSet<OrganizationDto> Organizations { get; set; }
		public virtual DbSet<EmergencyApplicationDto> EmergencyApplications { get; set; }

		public AdsDbContext(string connectionString)
		{
			_connectionString = connectionString;
		}
		
		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
		{
// 			if (!optionsBuilder.IsConfigured)
// 			{
// #warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
// 				optionsBuilder.UseSqlServer(_connectionString);
// 			}
			if (!optionsBuilder.IsConfigured)
			{
//#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
//				optionsBuilder.UseSqlServer(_connectionString);

				var localConnectionString = "Server=DESKTOP-Q6M5SJP\\SQLEXPRESS;User Id=DESKTOP-Q6M5SJP\\admin;Integrated security=SSPI;database=adsreg1";
				optionsBuilder.UseSqlServer(localConnectionString);

			}
		}

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			// modelBuilder.Entity<StudentAddress>(entity =>
			// {
			//     entity.HasKey(e => e.StudentId);
			//
			//     entity.Property(e => e.StudentId)
			//         .HasColumnName("StudentID")
			//         .ValueGeneratedNever();
			//
			//     entity.Property(e => e.Address1)
			//         .IsRequired()
			//         .HasMaxLength(50)
			//         .IsUnicode(false);
			//
			//     entity.Property(e => e.Address2)
			//         .HasMaxLength(50)
			//         .IsUnicode(false);
			//
			//     entity.Property(e => e.City)
			//         .IsRequired()
			//         .HasMaxLength(50)
			//         .IsUnicode(false);
			//
			//     entity.Property(e => e.State)
			//         .IsRequired()
			//         .HasMaxLength(50)
			//         .IsUnicode(false);
			//
			//     entity.HasOne(d => d.Student)
			//         .WithOne(p => p.StudentAddress)
			//         .HasForeignKey<StudentAddress>(d => d.StudentId)
			//         .HasConstraintName("FK_StudentAddress_Student");
			// });
		}
	}
}