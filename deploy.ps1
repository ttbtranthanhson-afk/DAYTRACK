# deploy.ps1 - Build va push len GitHub
# Cach dung: click chuot phai -> Run with PowerShell
# Hoac mo terminal va chay: .\deploy.ps1
# Hoac kem theo commit message: .\deploy.ps1 "mo ta thay doi"

$env:PATH += ";C:\Program Files\Git\cmd"

# Lay commit message tu tham so hoac dung mac dinh
$commitMsg = if ($args[0]) { $args[0] } else { "update: $(Get-Date -Format 'dd/MM/yyyy HH:mm')" }

Write-Host ""
Write-Host "=== DAYTRACK DEPLOY ===" -ForegroundColor Cyan
Write-Host ""

# Buoc 1: Build
Write-Host "[1/4] Building..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build that bai!" -ForegroundColor Red
    exit 1
}
Write-Host "Build thanh cong!" -ForegroundColor Green

# Buoc 2: Cap nhat docs
Write-Host ""
Write-Host "[2/4] Cap nhat docs..." -ForegroundColor Yellow
if (Test-Path "docs") { Remove-Item -Recurse -Force "docs" }
Copy-Item -Recurse "dist" "docs"
Write-Host "Cap nhat docs thanh cong!" -ForegroundColor Green

# Buoc 3: Git commit
Write-Host ""
Write-Host "[3/4] Commit: '$commitMsg'" -ForegroundColor Yellow
git add .
git commit -m $commitMsg
if ($LASTEXITCODE -ne 0) {
    Write-Host "Khong co gi thay doi hoac commit that bai." -ForegroundColor DarkYellow
}

# Buoc 4: Push
Write-Host ""
Write-Host "[4/4] Pushing len GitHub..." -ForegroundColor Yellow
git push
if ($LASTEXITCODE -ne 0) {
    Write-Host "Push that bai!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== DEPLOY THANH CONG ===" -ForegroundColor Green
Write-Host "GitHub Pages: https://ttbtranthanhson-afk.github.io/DAYTRACK/" -ForegroundColor Cyan
Write-Host "(cho 1-2 phut de GitHub Pages cap nhat)" -ForegroundColor DarkGray
Write-Host ""
