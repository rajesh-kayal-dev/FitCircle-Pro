# kill-ports.ps1 - Frees up all FitcirclePro service ports before starting
$ports = @(5000, 5001, 5002, 5003, 5004, 5005, 5006, 5007)

foreach ($port in $ports) {
    $pids = netstat -ano | Select-String ":$port " | Select-String "LISTENING" | ForEach-Object {
        ($_ -split '\s+')[-1]
    }
    foreach ($p in $pids) {
        if ($p -match '^\d+$') {
            Write-Host "Killing PID $p on port $port" -ForegroundColor Yellow
            taskkill /PID $p /F 2>$null
        }
    }
}
Write-Host "✅ All ports cleared!" -ForegroundColor Green
