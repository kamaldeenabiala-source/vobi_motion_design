# VOBI — Publicités motion design (Remotion)

Pub n° 1 en production : **Script 5 — « 50 000 FCFA de loyer… et 10 000 FCFA déjà dépensés »**
Format : vertical **1080 × 1920**, **30 fps**, ≈ 64 s, 7 scènes, MP4 H.264.

## Commandes

```console
npm run dev            # Remotion Studio (prévisualisation)
npm run render         # export final → out/VOBI_Script5_50000FCFA_1080x1920_30fps.mp4
npm run audio:vo       # régénère la voix off provisoire (synthèse Windows, voix Paul)
npm run audio:gen      # régénère musique + effets sonores provisoires
npm run lint           # ESLint + TypeScript
```

Dans le Studio :

- `VobiAd-Script5` : la pub complète.
- `Scenes-Script5/S1…S7` : chaque scène en composition indépendante.
- `References/CharacterSheet` : la fiche des personnages.
- `References/ContactSheet` : une planche de 9 images figées par scène, pour vérifier vite.

## Architecture

| Dossier | Rôle |
| --- | --- |
| `src/config/timeline.ts` | **Source unique de timing** : durée des scènes, répliques de la voix off (texte du script mot pour mot), découpage des sous-titres |
| `src/config/brand.ts` | Charte VOBI officielle (couleurs, dégradés, ombres, logo, appel à l'action) |
| `src/config/palette.ts` | Gamme « décor » (peaux, latérite, ciel, jaune zém), extension à valider |
| `src/characters/` | `bible.ts` (fiche unique de chaque personnage), `Character.tsx` (rig unique), `expressions.ts`, `poses.ts` |
| `src/props/` | Billets, compteur de dépenses (odomètre), bulle maison, objets (moto, ventilateur, chèvre…) |
| `src/sets/` | Décors : chambre, rue de Cotonou, maison visitée, carrefour, coin d'ombre, nouvelle maison |
| `src/vobi-ui/` | Interface VOBI reconstruite d'après les maquettes visiteur (accueil/recherche, liste, vérification), carte du Bénin, smartphone |
| `src/motion/` | Courbes d'animation, caméra virtuelle, secousses, filage (whip-pan) |
| `src/audio/` | Voix off + sous-titres par scène, musique avec ducking, effets sonores |
| `src/scenes/` | Les 7 scènes |
| `scripts/` | Génération de la voix off et de l'audio provisoires, mesure des répliques |

## Remplacer les éléments provisoires

1. **Voix off** : déposer `vo01.wav` … `vo11.wav` dans `public/audio/vo/`, une réplique par fichier (liste dans `timeline.ts`). Lancer ensuite `node scripts/measure-vo.cjs` : les sous-titres et le ducking se recalent seuls. Si une réplique est plus longue, ajuster `at` ou la durée de la scène dans `timeline.ts`.
2. **Musique** : remplacer `public/audio/music/tension.wav`, `positive.wav` et `reverie.wav`. Les coupes sont dans `src/audio/Music.tsx`.
3. **Effets sonores** : remplacer les fichiers de `public/audio/sfx/` en gardant les mêmes noms.
4. **Appel à l'action** : compléter `CTA.url` dans `src/config/brand.ts`. Tant qu'il reste vide, aucune adresse n'est affichée.
5. **Annonces de la démo** : les données d'exemple sont dans `src/vobi-ui/Screens.tsx` (`LISTINGS`).

## Licence

Remotion peut exiger une licence entreprise selon la taille de la structure : https://www.remotion.dev/license
