# Génère une voix off PROVISOIRE plus posée (rate 0.98) pour Script 1 V2
# Usage : powershell -ExecutionPolicy Bypass -File scripts/generate-vo-v2-script1.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'public/audio/vo-v2-script1'
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
  'vo01' = "Tu as prévu un budget pour louer une maison. Tu sais également à peu près ce que tu recherches : le nombre de chambres, l'environnement idéal..."
  'vo02' = "Pourtant, lorsque tu commences tes recherches, tu trouves des maisons dont le loyer dépasse ton budget. D'autres correspondent à ton budget, mais ne répondent pas à tes attentes."
  'vo03' = "Alors, tu continues de chercher. Tu contactes des démarcheurs, tu visites des logements, tu dépenses de l'argent pour te déplacer, tu paies les démarches... et tout ça, parfois, sans aucun résultat."
  'vo04' = "Le problème, ce n'est pas forcément que le logement que tu recherches n'existe pas. C'est surtout que tu ne disposes pas de suffisamment d'informations pour bien orienter tes recherches."
  'vo05' = "Imagine que tu puisses, depuis chez toi, avoir accès à plusieurs logements disponibles, dans le quartier que tu souhaites, la ville que tu préfères et l'environnement qui te convient."
  'vo06' = "Imagine que tu n'aies plus besoin de payer un démarcheur pour chaque recherche et que tu puisses même inspecter un logement, vérifier s'il te convient, avant de te déplacer pour le visiter."
  'vo07' = "Zéro temps perdu. Zéro dépense inutile."
  'vo08' = "C'est dans cette logique que Vobi a été conçue."
  'vo09' = "Avec Vobi, tu peux découvrir plusieurs possibilités de logement, consulter les offres et choisir selon tes critères, notamment ton budget et tes attentes."
  'vo10' = "Avec Vobi, tu peux enfin chercher ton logement plus facilement, sans multiplier les déplacements inutiles. Vobi, bientôt disponible."
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
