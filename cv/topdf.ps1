# Converts the two built CVs to PDF with Microsoft Word (Windows only).
# Private PDF -> Desktop\Yarida CV\1 Current CV\Yarida_Kaewthong_CV_2026.pdf (never committed)
# Public PDF  -> repo root Yarida-Kaewthong-CV.pdf (the download on the website),
#                plus a copy in Desktop\Yarida CV\1 Current CV\Yarida_Kaewthong_CV_public.pdf
$cv = $PSScriptRoot
$root = Split-Path $cv -Parent
$w = New-Object -ComObject Word.Application
$w.Visible = $false
$current = Join-Path (Split-Path $root -Parent) '1 Current CV'   # Desktop\Yarida CV\1 Current CV
if (-not (Test-Path $current)) { New-Item -ItemType Directory -Path $current | Out-Null }
$jobs = @(
  @{ docx = "$cv\Yarida_Kaewthong_CV_2026.docx";   pdf = "$current\Yarida_Kaewthong_CV_2026.pdf" },
  @{ docx = "$cv\Yarida_Kaewthong_CV_public.docx"; pdf = "$root\Yarida-Kaewthong-CV.pdf" }
)
foreach ($j in $jobs) {
  if (-not (Test-Path $j.docx)) { "skip (not built): " + $j.docx; continue }
  $d = $w.Documents.Open($j.docx)
  (Split-Path $j.docx -Leaf) + " pages: " + $d.ComputeStatistics(2)
  $d.SaveAs2($j.pdf, 17)
  $d.Close($false)
  "written " + $j.pdf
}
$w.Quit()
if (Test-Path "$root\Yarida-Kaewthong-CV.pdf") {
  Copy-Item "$root\Yarida-Kaewthong-CV.pdf" "$current\Yarida_Kaewthong_CV_public.pdf" -Force
  "copied  $current\Yarida_Kaewthong_CV_public.pdf"
}
