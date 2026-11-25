# Génère une voix off PROVISOIRE plus posée (rate 0.98) pour Script 4 V2
# Usage : powershell -ExecutionPolicy Bypass -File scripts/generate-vo-v2-script4.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'public/audio/vo-v2-script4'
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
  'vo06' = "Et si le problème venait simplement du fait que tu n'as pas encore accès à assez de logements pour faire un meilleur choix ?"
  'vo07' = "Peut-être qu'il existe une maison qui te plaît tout autant, mais avec un loyer plus adapté à ton budget. Encore faut-il pouvoir la découvrir !"
  'vo08' = "Avec Vobi, tu peux découvrir différentes offres de logement, voir les loyers et comparer les maisons avant de faire ton choix."
  'vo09' = "Tu n'es donc plus obligé de te limiter aux quelques maisons qu'on t'a proposées ou que tu as eu l'occasion de visiter."
  'vo10' = "Tu as accès à plus d'offres et donc à plus de possibilités pour trouver ce qui te convient."
  'vo11' = "Avec Vobi, tu peux trouver une maison qui te plaît sans laisser son loyer vider tes poches. Vobi, bientôt disponible."
}

foreach ($k in $lines.Keys) {
  $text = [System.Security.SecurityElement]::Escape($lines[$k])
  $ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='fr-FR'><prosody rate='0.98' pitch='+0%'>$text</prosody></speak>"
  $stream = Await ($synth.SynthesizeSsmlToStreamAsync($ssml)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
  $in = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream)
  $path = Join-Path $outDir "$k.wav"
  $out = [System.IO.File]::Create($path)
  $in.CopyTo($out)
  $out.Close(); $in.Close()
  Write-Output "OK $k"
}
