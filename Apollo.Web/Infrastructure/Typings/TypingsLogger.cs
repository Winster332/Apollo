using System.Collections.Generic;
using System.IO;
using Functional.Maybe;
using JetBrains.Annotations;
using MoreLinq;

namespace Apollo.Web.Infrastructure.Typings
{
	public class TypingsLogger
	{
		private readonly Maybe<string> _logFile;
		private int _indentation;

		private TypingsLogger(Maybe<string> logFile)
		{
			_logFile = logFile;

			_logFile.Do(path =>
				File.WriteAllLines(path, new string[0]));

			_indentation = 0;
		}

		public void StartSection(string sectionName)
		{
			LogLine(sectionName);
			_indentation++;
		}

		public void EndSection(bool addDelimiter = true)
		{
			if (addDelimiter) LogLine("\r\n");

			_indentation--;
		}

		public void LogLines(IEnumerable<string> lines) => lines.ForEach(LogLine);

		[UsedImplicitly]
		public void LogLine(string line) =>
			_logFile.Do(path => {
				var indentedLine = $"{new string('\t', _indentation)}{line}\r\n";
				File.AppendAllText(path, indentedLine);
			});

		[UsedImplicitly]
		public static TypingsLogger ToFile(string logFilePath) => new(logFilePath.ToMaybe());

		[UsedImplicitly]
		public static TypingsLogger Empty() => new(default);
	}
}