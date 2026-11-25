# Génère une voix off PROVISOIRE (synthèse vocale Windows, voix "Paul" fr-FR)
# pour le Script 3 (« La maison qui plaît, le loyer qui pèse — version A »).
# Usage : powershell -ExecutionPolicy Bypass -File scripts/generate-vo-script3.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'public/audio/vo-script3'
New-Item -ItemType Directory -Force $outDir | Out-Null

Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media, ContentType = WindowsRuntime]
$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and
    $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($op, [Type]$resultType) {
  $t = $asTaskGeneric.MakeGenericMethod($resultType).Invoke($null, @($op))
  $t.Wait(-1) | Out-Null
  $t.Result
}

$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$voice = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object { $_.DisplayName -eq 'Microsoft Paul' }
if ($voice) { $synth.Voice = $voice }

$lines = [ordered]@{
  'vo01' = "Tu as trouvé une maison qui te plaît, mais son loyer risque de peser sur ton budget à la fin du mois. Que faire ?"
  'vo02' = "C'est vrai, la maison te plaît. Tu as envie de t'y installer, mais tu sais aussi que tu as d'autres dépenses à gérer."
  'vo03' = "Tu ne veux pas passer tout ton mois à payer le loyer et te retrouver à faire des calculs chaque fois que tu dois acheter quelque chose."
  'vo04' = "D'un autre côté, tu n'as pas envie de choisir une maison qui ne te plaît pas simplement parce qu'elle coûte moins cher."
  'vo05' = "Alors, tu hésites. Est-ce que tu dois accepter cette maison et réduire certaines dépenses ? Ou continuer à chercher en espérant trouver mieux ?"
  'vo06' = "Le plus difficile, c'est que tu ne sais pas toujours quelles autres maisons sont disponibles. Peut-être qu'il existe un logement qui te plaît autant, avec un loyer plus adapté à ton budget, mais tu ne l'as tout simplement pas encore découvert."
  'vo07' = "C'est justement pour avoir plus de choix qu'il est important de bien s'informer avant de prendre une décision."
  'vo08' = "Avec Vobi, tu peux découvrir différentes offres de logement, voir les loyers et comparer les maisons avant de faire ton choix."
  'vo09' = "Tu n'es donc plus obligé de te limiter aux quelques maisons qu'on t'a proposées ou que tu as eu l'occasion de visiter."
  'vo10' = "Prends le temps de regarder les possibilités, de comparer et de choisir une maison dans laquelle tu te sentiras bien, sans mettre toutes tes dépenses de côté."
  'vo11' = "Avec Vobi, tu peux trouver une maison qui te plaît sans laisser son loyer vider tes poches."
}

foreach ($k in $lines.Keys) {
  $text = [System.Security.SecurityElement]::Escape($lines[$k])
  $ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='fr-FR'><prosody rate='1.2' pitch='+0%'>$text</prosody></speak>"
  $stream = Await ($synth.SynthesizeSsmlToStreamAsync($ssml)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
  $in = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream)
  $path = Join-Path $outDir "$k.wav"
  $out = [System.IO.File]::Create($path)
  $in.CopyTo($out)
  $out.Close(); $in.Close()
  Write-Output "OK $k"
}
