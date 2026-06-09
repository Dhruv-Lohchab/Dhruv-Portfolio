Add-Type -AssemblyName System.Drawing
$source = "d:\Work\Antigravity Folder\Dhruv-Portfolio\Dhruv-Portfolio\photo-3.png"
$dest = "d:\Work\Antigravity Folder\Dhruv-Portfolio\Dhruv-Portfolio\photo-3-compressed.jpg"
$img = [System.Drawing.Image]::FromFile($source)
$img.Save($dest, [System.Drawing.Imaging.ImageFormat]::Jpeg)
$img.Dispose()
