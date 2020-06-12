# Setup
[System.Collections.ArrayList]$targets = @()
if ($args.Count -ne 0) {
    if ($args.Contains("win")) {
        $targets.Add(@{ os = "win32"; arch = "x64" }) > $null
        $targets.Add(@{ os = "win32"; arch = "ia32" }) > $null
    }
    if ($args.Contains("linux")) {
        $targets.Add(@{ os = "linux"; arch = "x64" }) > $null
        $targets.Add(@{ os = "linux"; arch = "ia32" }) > $null
    }
}
else {
    Write-Error -ErrorId "no-args" -Message "Please specify the build target!"
    Exit 10
}

# Start
Write-Output "Creating builds..."

# Check if we are running in the correct directory
if (-Not (Test-Path -Path "../package.json" -PathType Leaf)) {
    Write-Error -ErrorId "wrong-dir" -Message "Could not find package.json! Running from the wrong directory?"
    Exit 1
}

# Re-Create builds directory
if (Test-Path -Path "./builds" -PathType Container) {
    Remove-Item -Path "./builds" -Recurse
}
New-Item -Path "./builds" -ItemType Directory > $null

# Install NPM packages
Write-Output "Installing NPM packages..."
$process = (Start-Process -FilePath "npm" -WorkingDirectory ".." -ArgumentList "install" -Wait -NoNewWindow -PassThru)
if ($process.ExitCode -gt 0) {
    Write-Error -ErrorId "npm-failed" -Message "NPM failed to install packages"
    Exit 2
}

# Clear project build directory
if (Test-Path -Path "../dist" -PathType Container) {
    Remove-Item -Path "../dist" -Recurse
}

# Build project in production mode
Write-Output "Building project..."
$process = (Start-Process -FilePath "npm" -WorkingDirectory ".." -ArgumentList "run build-prod" -Wait -NoNewWindow -PassThru)
if ($process.ExitCode -gt 0) {
    Write-Error -ErrorId "project-build-failed" -Message "Project production build failed"
    Exit 3
}

# Copy app package.json
Copy-Item -Path "../src/package.json" -Destination "../dist/package.json" -Force > $null

# Create electron packages
Write-Output "Creating electron packages..."

foreach ($target in $targets) {
    $pargs = "dist lm-client --asar --out=build/builds --platform=$($target.os) --arch=$($target.arch) --overwrite"
    $process = (Start-Process -FilePath "npm" -WorkingDirectory ".." -ArgumentList "run packager -- $pargs" -Wait -NoNewWindow -PassThru)
    if ($process.ExitCode -gt 0) {
        Write-Error -ErrorId "package-build-failed" -Message "Electron packaging failed"
        Exit 4
    }
}

# Rename the directories
$patterns = @(
    @{ s = "*-win32*"; m = '(.*)-win32(.*)'; r = '$1-win$2' }
    @{ s = "*-ia32*"; m = '(.*)-ia32(.*)'; r = '$1-x86$2' }
)

foreach ($p in $patterns) {
    Get-ChildItem -Path "./builds" -Attributes Directory -Filter $p.s | Rename-Item -NewName { $_.Name -replace $p.m, $p.r }
}

# Re-Create packages directory
if (Test-Path -Path "./packages" -PathType Container) {
    Remove-Item -Path "./packages" -Recurse
}
New-Item -Path "./packages" -ItemType Directory > $null

# Zipping packages
Write-Output = "Compressing packages for distribution..."
$packages = Get-ChildItem -Path "./builds" -Attributes Directory -Name
foreach ($package in $packages) {
    if ($package.ToString().Contains("-linux-")) {
        $process = (Start-Process -FilePath "tar" -ArgumentList "-czvf `"./packages/$package.tar.gz`" -C `"./builds/$package`" ." -Wait -NoNewWindow -PassThru)
        if ($process.ExitCode -gt 0) {
            Write-Error -ErrorId "archive-tar-failed" -Message "Tar compression failed"
            Exit 5
        }
    }
    else {
        Compress-Archive -Path "./builds/$package/*" -DestinationPath "./packages/$package.zip" -CompressionLevel Optimal
    }
}

# Done
Write-Output "Complete"