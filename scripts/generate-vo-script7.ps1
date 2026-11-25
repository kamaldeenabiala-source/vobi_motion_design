# Génère une voix off PROVISOIRE (synthèse vocale Windows, voix "Paul" fr-FR)
# pour le Script 7 (« La maison moderne dont tu rêves »).
# Usage : powershell -ExecutionPolicy Bypass -File scripts/generate-vo-script7.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'public/audio/vo-script7'
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
  'vo01' = "Tu rêves d'une maison moderne, avec un beau salon, une cuisine bien aménagée, de belles chambres et un cadre agréable où tu prends plaisir à rentrer chaque soir."
  'vo02' = "Tu as déjà quelques idées de la maison dans laquelle tu aimerais vivre. Peut-être même que tu as enregistré quelques photos de maisons qui te plaisent sur ton téléphone."
  'vo03' = "Mais quand tu commences à chercher, la réalité est parfois différente."
  'vo04' = "Les maisons qui correspondent à tes goûts sont souvent trop chères. Et celles qui entrent dans ton budget ne ressemblent pas vraiment à ce que tu recherches."
  'vo05' = "Tu finis alors par te demander : est-ce qu'il faut forcément dépenser beaucoup d'argent pour avoir une maison qui me plaît ?"
  'vo06' = "Pas forcément ! Le problème, c'est que tes offres sont limitées."
  'vo07' = "Tu cherches entre tes proches, entre des annonces, entre des on-dit. Pourtant, le marché compte plusieurs logements, dont certains adaptés à tes besoins."
  'vo08' = "Avec Vobi, tu peux consulter plusieurs offres de logement, choisir ton budget, la ville, le quartier et le nombre de chambres que tu souhaites."
  'vo09' = "Tu peux prendre le temps de regarder les maisons, comparer les offres et découvrir celles qui correspondent le mieux à tes goûts et à tes moyens."
  'vo10' = "Tu n'es plus obligé de choisir parmi les quelques maisons que tu as eu l'occasion de voir."
  'vo11' = "Ta maison idéale existe peut-être déjà. Encore faut-il pouvoir la trouver ! Découvre plus de logements avec Vobi."
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
