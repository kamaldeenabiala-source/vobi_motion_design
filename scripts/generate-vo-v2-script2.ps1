# Génère une voix off PROVISOIRE plus posée (rate 0.98) pour Script 2 V2
# Usage : powershell -ExecutionPolicy Bypass -File scripts/generate-vo-v2-script2.ps1

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root 'public/audio/vo-v2-script2'
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
  'vo01' = "Ton patron a augmenté ton salaire."
  'vo02' = "Tu souhaites louer une maison qui te plaît, dans un environnement agréable, avec une école pour les enfants, une route pratique pour te rendre au travail, des marchés et des commerces à proximité."
  'vo03' = "Mais il y a un problème. Les maisons qu'on te propose ou que tu découvres sont souvent trop chères."
  'vo04' = "Bien sûr, tu pourrais prendre l'une d'elles. Mais après avoir payé le loyer, est-ce qu'il te restera assez pour les autres dépenses : l'eau, l'électricité, la nourriture, le transport et tout le reste ?"
  'vo05' = "Tu cherches une maison qui correspond à tes moyens et qui te permet de bien vivre sans avoir à compter chaque franc à la fin du mois."
  'vo06' = "Alors, tu demandes à tes proches, tu prends des heures de travail pour aller chercher des logements. Même tes jours de repos sont utilisés pour les visites. Et tout ça, parfois, sans aucun résultat."
  'vo07' = "Imagine pouvoir chercher autrement ! Trouver des logements selon ton budget, dans la ville ou le quartier que tu souhaites, tout ça depuis chez toi."
  'vo08' = "Plus besoin de demander des heures de permission au travail ou de sacrifier tes jours de repos pour chercher une maison."
  'vo09' = "Tu peux simplement t'allonger dans ton lit après une longue journée de travail, consulter les logements disponibles, comparer les offres et voir ceux qui correspondent à tes besoins."
  'vo10' = "En quelques heures, tu peux déjà découvrir plusieurs possibilités sans avoir à te déplacer partout."
  'vo11' = "C'est dans cette logique que Vobi a été conçue. Avec Vobi, tu as accès à plusieurs possibilités de logement et tu peux faire tes recherches selon ton budget et tes critères, sans bouleverser ton emploi du temps."
  'vo12' = "Avec Vobi, les logements viennent à toi, pas le contraire. Vobi, bientôt disponible."
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
