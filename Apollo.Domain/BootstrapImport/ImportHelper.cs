using System.IO;
using Apollo.Domain.Spreadsheets;

namespace Apollo.Domain.BootstrapImport
{
	public class ImportHelper
	{
		public const string BasePath = "BootstrapImport";
		private static string MiddlePartPath => Path.Combine("bin", "Debug", "net5.0");
		public static string CategoriesPath => Path.Combine(MiddlePartPath, BasePath, "Категории.xlsx");
		public static string InternetApplicationsPath => Path.Combine(MiddlePartPath, BasePath, "Интернет-обращения.xlsx");
		public static string MKDNevkiyPath => Path.Combine(MiddlePartPath, BasePath, "МКД_Невского_р-на.xlsx");
		public static string ReportForLoadPath => Path.Combine(MiddlePartPath, BasePath, "Отет для загрузки 1.xlsx");
		public static string MKDNevskiyWithoutAddHousesPath => Path.Combine(MiddlePartPath, BasePath, "МКД_Невского_р-на без доп домов.xlsx");
		public static string ReportByVk => Path.Combine(MiddlePartPath, BasePath, "Отчет ВК.xlsx");
		public static string ReportByIdiot => Path.Combine(MiddlePartPath, BasePath, "ОТЧЕТ ПО БЕГЛОВУ.xlsx");

		public static Workbook Open(string filePath)
		{
			using var stream = new FileStream(filePath, FileMode.Open);
			var workbook = Workbook.FromFile(stream);

			return workbook;
		}
	}
}