#.\clean.ps1

Write-Output "##teamcity[compilationStarted compiler='webpack']"

$res = (yarn build-prod)

Write-Output $res

$res | Where-Object { $_.ToLowerInvariant().Contains('error') } | ForEach-Object { 
    $error = $_
    $escaped = $error.Replace("'", "|'")
    Write-Output "##teamcity[buildProblem description='$escaped']"
} 

Write-Output "##teamcity[compilationFinished compiler='webpack']"