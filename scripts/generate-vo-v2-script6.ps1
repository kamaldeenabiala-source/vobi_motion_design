# Génère une voix off PROVISOIRE plus posée (rate 0.98) pour Script 6 V2
# Usage : powershell -ExecutionPolicy Bypass -File scripts/generate-vo-v2-script6.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'public/audio/vo-v2-script6'
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
  'vo01' = "Tu vis dans une maison où la cour est partagée avec les voisins ?"
  'vo02' = "Au début, tu te dis que ce n'est pas bien grave. Mais avec le temps, les petits problèmes commencent à s'accumuler."
  'vo03' = "Les enfants des voisins jouent devant ta porte, les cris et les disputes entre enfants deviennent presque quotidiens. Tu veux laisser tes propres enfants jouer tranquillement, mais tu dois toujours faire attention à ne pas déranger les autres."
  'vo04' = "Parfois, tu ne peux même pas profiter tranquillement de la cour avec ta famille. Tu dois partager l'espace pour étendre ton linge, garer ta moto ou simplement t'asseoir un moment."
  'vo05' = "Et quand tu veux te reposer, les bruits des voisins ne te facilitent pas toujours la tâche. Même les heures de sommeil ne sont pas épargnées !"
  'vo06' = "À force, tu commences à te dire qu'il est temps de trouver une maison avec une cour privée."
  'vo07' = "Un espace où tes enfants pourront jouer librement, où tu pourras passer du temps avec ta famille et où chacun pourra profiter de son espace sans déranger les voisins."
  'vo08' = "Mais dans tes recherches, un autre problème se présente. Les maisons avec cour que tu trouves sont parfois trop éloignées de l'école des enfants, de ton lieu de travail ou des endroits que tu fréquentes. D'autres sont dans des quartiers qui ne te plaisent pas."
  'vo09' = "Vobi te permet d'avoir la vie plus facile. Tu ne peux pas choisir une maison que tu ne connais même pas !"
  'vo10' = "Avec Vobi, tu peux découvrir davantage de logements disponibles, choisir la ville, le quartier, ton budget et les caractéristiques que tu recherches."
  'vo11' = "Tu as ainsi plus de possibilités de trouver une maison avec cour, bien située et adaptée aux besoins de toute ta famille."
  'vo12' = "Avec Vobi, découvre plus de logements pour trouver celui qui te convient vraiment. Vobi, bientôt disponible."
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
