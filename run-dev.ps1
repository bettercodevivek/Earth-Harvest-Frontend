# PowerShell script to run Vite dev server
# This works around path issues with special characters

$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Use node to run vite directly
node ".\node_modules\vite\bin\vite.js"

