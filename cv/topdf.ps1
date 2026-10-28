# Converts the two built CVs to PDF with Microsoft Word (Windows only).
# Private PDF -> Desktop\Yarida CV\Yarida_Kaewthong_CV_2026.pdf (never committed)
# Public PDF  -> repo root Yarida-Kaewthong-CV.pdf (the download on the website)
$cv = $PSScriptRoot
$root = Split-Path $cv -Parent
$w = New-Object -ComObject Word.Application
$w.Visible = $false
$jobs = @(
  @{ docx = "$cv\Yarida_Kaewthong_CV_2026.docx";   pdf = "C:\Users\jojow\OneDrive\Desktop\Yarida CV\Yarida_Kaewthong_CV_2026.pdf" },
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
