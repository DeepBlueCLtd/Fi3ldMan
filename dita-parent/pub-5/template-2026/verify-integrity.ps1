# Verifies this publishing template against MANIFEST.sha256 after a transfer.
#
# Run from inside the template folder, on the receiving side:
#     powershell -NoProfile -ExecutionPolicy Bypass -File verify-integrity.ps1
#
# Uses only stock Windows PowerShell - no git bash, no network, no extra tools.
# See context-docs/12-template-transfer-air-gapped-network.md for the full
# transfer procedure.

$manifest = 'MANIFEST.sha256'

if (-not (Test-Path $manifest)) { Write-Output "FAIL: manifest not found: $manifest"; exit 1 }

$lines = @(Get-Content $manifest)
if ($lines.Count -eq 0) { Write-Output 'FAIL: manifest is empty'; exit 1 }

$bad = 0
foreach ($line in $lines) {
    $parts = $line -split '\s+\*', 2
    if ($parts.Count -ne 2) { Write-Output "FAIL: unreadable line: $line"; $bad++; continue }
    if (-not (Test-Path -LiteralPath $parts[1])) { Write-Output "MISSING: $($parts[1])"; $bad++; continue }
    $actual = (Get-FileHash -Algorithm SHA256 -LiteralPath $parts[1]).Hash.ToLower()
    if ($actual -ne $parts[0]) { Write-Output "MISMATCH: $($parts[1])"; $bad++ }
}

Write-Output "Files checked: $($lines.Count)   Problems: $bad"

if ($bad -gt 0) {
    Write-Output 'DO NOT USE THIS TEMPLATE - re-transfer required'
    exit 1
} else {
    Write-Output 'Integrity OK'
    exit 0
}
