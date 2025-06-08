$pythonRelPath = "server\bin\python-3.13.4"
$currentDir = (Get-Location).Path
$pythonPath = Join-Path $currentDir $pythonRelPath

$env:PATH = "$pythonPath;$env:PATH"

Write-Output "Python path set to $pythonPath"
