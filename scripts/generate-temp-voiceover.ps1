# Génère une voix off PROVISOIRE (synthèse vocale Windows, voix "Paul" fr-FR)
# pour caler le rythme de l'animatique. À remplacer par la voix du comédien.
# Usage : powershell -ExecutionPolicy Bypass -File scripts/generate-temp-voiceover.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'public/audio/vo'
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

# Texte phonétique pour la synthèse (le texte affiché vit dans src/config/script5.ts)
$lines = [ordered]@{
  'vo01' = 'Tu recherches une maison à cinquante mille francs CFA.'
  'vo02' = 'Mais voilà, tu as déjà dépensé dix mille francs CFA entre les démarcheurs, les frais de transport pour les visites et les démarches...'
  'vo03' = 'Et toujours pas de maison !'
  'vo04' = 'À ce rythme, on dirait que tu vas finir par vivre dans la rue !'
  'vo05' = "Mais sérieusement, pourquoi dépenser autant d'argent juste pour chercher un logement ?"
  'vo06' = 'Vobi te dit STOP à tout ça !'
  'vo07' = 'Découvre des milliers de possibilités de logement à travers le Bénin.'
  'vo08' = 'Choisis la ville, le quartier, ton budget, le nombre de chambres et découvre les offres qui correspondent à tes recherches.'
  'vo09' = 'Avec Vobi, tu peux consulter les logements, comparer les offres et même vérifier certains détails avant de te déplacer pour une visite.'
  'vo10' = "Moins de déplacements inutiles, moins de dépenses et surtout, plus de possibilités de trouver la maison qu'il te faut."
  'vo11' = 'Alors, ça te tente ?'
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
