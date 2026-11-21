import React from "react";
import { BRAND, GRADIENTS } from "../config/brand";
import { NNBSP, TABULAR } from "../theme/fonts";
import { Icon, type IconName } from "./icons";
import { VerifiedBadge, VobiLogo } from "./Brand";
import { BottomNav, SCREEN_W } from "./Phone";
import { HouseThumb, type ThumbVariant } from "./HouseThumb";

/**
 * Écrans VOBI reconstruits d'après les maquettes « visiteur »
 * (MaquetteVobi/visiteur/01, 02, 04). Mise en page conservée ; seules les
 * valeurs (budget, prix, titres) sont adaptées au scénario 50 000 FCFA.
 * Coordonnées logiques 390 × 844.
 */

export type Listing = {
  id: string;
  type: string;
  price: number;
  place: string;
  rooms: number;
  bath: number;
  area: number;
  thumb: ThumbVariant;
};

// Données de démonstration (illustratives).
export const LISTINGS: Listing[] = [
  { id: "a", type: "Chambre salon", price: 45000, place: "Cotonou · Akpakpa", rooms: 1, bath: 1, area: 30, thumb: "chambreSalon" },
  { id: "b", type: "Studio", price: 50000, place: "Cotonou · Akpakpa", rooms: 1, bath: 1, area: 34, thumb: "studio" },
  { id: "c", type: "Entrée-couché", price: 30000, place: "Cotonou · Akpakpa", rooms: 1, bath: 1, area: 20, thumb: "entreeCouche" },
  { id: "d", type: "Chambre salon", price: 40000, place: "Cotonou · Akpakpa", rooms: 1, bath: 1, area: 28, thumb: "maisonBasse" },
];

export const fmt = (n: number) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, NNBSP);

const Header: React.FC<{ icons?: IconName[] }> = ({ icons = ["user", "heart", "menu"] }) => (
  <div style={{ position: "absolute", top: 0, left: 0, width: SCREEN_W, height: 104, zIndex: 5, background: "rgba(248,250,251,0.96)", borderBottom: "1px solid rgba(226,232,240,0.7)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "50px 20px 0", boxSizing: "border-box" }}>
    <VobiLogo height={30} />
    <div style={{ display: "flex", gap: 16, color: BRAND.slate900 }}>
      {icons.map((i) => (
        <Icon key={i} name={i} size={22} />
      ))}
    </div>
  </div>
);

/* ---------------------------------------------------------------- Accueil */

export type FieldState = { value: string; active: number; filled: number };

const Field: React.FC<{ icon: IconName; label: string; st: FieldState; placeholder: string }> = ({ icon, label, st, placeholder }) => (
  <div
    style={{
      flex: 1,
      height: 58,
      borderRadius: 14,
      background: "#FFFFFF",
      border: `1.5px solid ${st.active > 0.01 ? BRAND.emerald : BRAND.border}`,
      boxShadow: st.active > 0.01 ? `0 0 0 ${4 * st.active}px rgba(5,150,105,0.18)` : "none",
      display: "flex",
      alignItems: "center",
      gap: 9,
      padding: "0 10px",
      scale: String(1 + 0.04 * Math.sin(Math.min(1, st.filled) * Math.PI)),
    }}
  >
    <Icon name={icon} size={18} color={st.filled > 0 ? BRAND.primary : BRAND.muted} />
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minWidth: 0 }}>
      <span style={{ fontSize: 10.5, color: BRAND.muted, fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: st.value ? BRAND.slate900 : "#A0AEC0", whiteSpace: "nowrap", ...TABULAR }}>{st.value || placeholder}</span>
    </div>
    {st.filled > 0.9 ? (
      <span style={{ width: 16, height: 16, borderRadius: 99, background: BRAND.emerald, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="check" size={11} color="#fff" stroke={3.4} />
      </span>
    ) : (
      <Icon name="chevronDown" size={15} color={BRAND.muted} />
    )}
  </div>
);

const Chip: React.FC<{ icon: IconName; label: string; on?: boolean }> = ({ icon, label, on }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: 62, padding: "8px 0", borderRadius: 12, background: on ? BRAND.mint : "#F8FAFB", border: `1px solid ${on ? "#BFE6D2" : BRAND.border}`, fontSize: 10, color: on ? BRAND.primary : BRAND.muted, fontWeight: 600 }}>
    <Icon name={icon} size={16} color={on ? BRAND.primary : BRAND.muted} />
    {label}
  </div>
);

export const HomeSearchScreen: React.FC<{
  ville: FieldState;
  quartier: FieldState;
  budget: FieldState;
  chambres: FieldState;
  searchPress: number;
  scroll?: number;
}> = ({ ville, quartier, budget, chambres, searchPress, scroll = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 90% 40% at 50% 0%, rgba(5,150,105,0.10), transparent), ${BRAND.background}` }}>
    <Header />
    <div style={{ position: "absolute", top: 112 - scroll, left: 20, right: 20 }}>
      <div style={{ fontSize: 29, fontWeight: 800, lineHeight: 1.12, letterSpacing: "-0.02em", color: BRAND.slate900 }}>
        Trouvez le logement qui vous correspond au Bénin
      </div>
      <div style={{ fontSize: 13, color: BRAND.muted, marginTop: 8, lineHeight: 1.4 }}>Des biens vérifiés, des visites immersives et une recherche simple pour trouver votre prochain chez-vous.</div>
      {/* carte de recherche */}
      <div style={{ marginTop: 18, background: "#FFFFFF", borderRadius: 22, padding: 12, boxShadow: "0 12px 30px -12px rgba(15,23,42,0.18)", border: `1px solid ${BRAND.border}` }}>
        <div style={{ display: "flex", gap: 8 }}>
          <Field icon="mapPin" label="Ville" st={ville} placeholder="Choisir" />
          <Field icon="building" label="Quartier" st={quartier} placeholder="Choisir" />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          <Field icon="wallet" label="Budget max" st={budget} placeholder="—" />
          <Field icon="bed" label="Chambres" st={chambres} placeholder="—" />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          <Chip icon="droplet" label="Eau" on={budget.filled > 0.5} />
          <Chip icon="zap" label="Électricité" on={budget.filled > 0.5} />
          <Chip icon="parking" label="Parking" />
          <Chip icon="wifi" label="WiFi" />
          <Chip icon="snow" label="Clim" />
        </div>
        <div
          style={{
            marginTop: 12,
            height: 50,
            borderRadius: 16,
            background: GRADIENTS.primary,
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            boxShadow: "0 16px 30px -14px rgba(5,150,105,0.8)",
            scale: String(1 - 0.05 * Math.sin(Math.min(1, searchPress) * Math.PI)),
          }}
        >
          <Icon name="search" size={18} color="#fff" stroke={2.6} /> Rechercher
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
        {[
          ["home", "Logements disponibles"],
          ["shieldCheck", "Biens vérifiés sur le terrain"],
          ["user", "Utilisateurs satisfaits"],
        ].map(([ic, l]) => (
          <div key={l} style={{ flex: 1, background: "#fff", borderRadius: 14, padding: 10, border: `1px solid ${BRAND.border}`, fontSize: 10, color: BRAND.muted, lineHeight: 1.3 }}>
            <Icon name={ic as IconName} size={18} color={BRAND.primary} />
            <div style={{ marginTop: 6 }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
    <BottomNav active="Accueil" />
  </div>
);

/* ---------------------------------------------------------------- Liste */

export const ListingRow: React.FC<{ l: Listing; heart?: number; style?: React.CSSProperties }> = ({ l, heart = 0, style }) => (
  <div style={{ display: "flex", gap: 12, background: "#FFFFFF", borderRadius: 18, padding: 8, border: `1px solid ${BRAND.border}`, boxShadow: "0 8px 20px -14px rgba(15,23,42,0.25)", ...style }}>
    <div style={{ position: "relative", width: 128, height: 96, borderRadius: 12, overflow: "hidden", flexShrink: 0 }}>
      <HouseThumb variant={l.thumb} width={128} height={96} />
      <div style={{ position: "absolute", left: 6, top: 6 }}>
        <VerifiedBadge scale={0.85} />
      </div>
      <div style={{ position: "absolute", right: 6, top: 6, width: 24, height: 24, borderRadius: 99, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", scale: String(1 + 0.35 * Math.sin(Math.min(1, heart) * Math.PI)) }}>
        <Icon name="heart" size={14} color={heart > 0.3 ? "#E11D48" : BRAND.slate900} fill={heart > 0.3 ? "#E11D48" : "none"} />
      </div>
    </div>
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 3, minWidth: 0 }}>
      <div style={{ fontSize: 16, fontWeight: 800, color: BRAND.primary, ...TABULAR }}>
        {fmt(l.price)} FCFA <span style={{ fontSize: 12, fontWeight: 600 }}>/ mois</span>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: BRAND.slate900 }}>{l.type}</div>
      <div style={{ fontSize: 11.5, color: BRAND.muted, display: "flex", alignItems: "center", gap: 4 }}>
        <Icon name="mapPin" size={12} /> {l.place}
      </div>
      <div style={{ display: "flex", gap: 10, fontSize: 11, color: BRAND.muted, marginTop: 2 }}>
        <span style={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Icon name="bed" size={12} /> {l.rooms} ch.
        </span>
        <span style={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Icon name="bath" size={12} /> {l.bath} sdb
        </span>
        <span style={{ display: "flex", gap: 3, alignItems: "center" }}>
          <Icon name="maximize" size={12} /> {l.area} m²
        </span>
      </div>
    </div>
  </div>
);

export const ListingsScreen: React.FC<{ reveal: (i: number) => number; heart?: (i: number) => number; scroll?: number }> = ({ reveal, heart = () => 0, scroll = 0 }) => (
  <div style={{ position: "absolute", inset: 0, background: BRAND.background }}>
    <Header icons={["search", "heart", "menu"]} />
    <div style={{ position: "absolute", top: 108 - scroll, left: 18, right: 18 }}>
      <div style={{ fontSize: 10.5, letterSpacing: "0.14em", fontWeight: 700, color: BRAND.primary }}>IMMOBILIER AU BÉNIN</div>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", marginTop: 4 }}>Rechercher un logement</div>
      <div style={{ display: "flex", marginTop: 12, background: "#EEF2F5", borderRadius: 14, padding: 4 }}>
        <div style={{ flex: 1, height: 36, borderRadius: 11, background: BRAND.primary, color: "#fff", fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Icon name="list" size={15} color="#fff" /> Liste
        </div>
        <div style={{ flex: 1, height: 36, color: BRAND.slate900, fontWeight: 600, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <Icon name="map" size={15} /> Carte
        </div>
      </div>
      <div style={{ marginTop: 10, background: "#fff", borderRadius: 16, padding: "10px 12px", border: `1px solid ${BRAND.border}`, display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }}>
        <Icon name="sliders" size={16} color={BRAND.primary} />
        {["Cotonou", "Akpakpa", "≤ 50 000 FCFA", "1 ch. +"].map((t) => (
          <span key={t} style={{ fontSize: 11.5, fontWeight: 700, color: BRAND.primary, background: BRAND.mint, borderRadius: 99, padding: "4px 9px", ...TABULAR }}>
            {t}
          </span>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 14 }}>
        <span style={{ fontSize: 16, fontWeight: 800 }}>48 logements</span>
        <span style={{ fontSize: 11.5, color: BRAND.muted }}>Trier par : Plus récents</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
        {LISTINGS.map((l, i) => {
          const r = reveal(i);
          return <ListingRow key={l.id} l={l} heart={heart(i)} style={{ opacity: r, translate: `0px ${(1 - r) * 60}px`, scale: String(0.94 + 0.06 * r) }} />;
        })}
      </div>
    </div>
    <BottomNav active="Rechercher" />
  </div>
);

/* ---------------------------------------------------------------- Détail + vérification */

export const VerificationScreen: React.FC<{ checks: (i: number) => number; stamp: number; scroll?: number }> = ({ checks, stamp, scroll = 0 }) => {
  const items = ["Eau potable", "Électricité fonctionnelle", "État de la toiture : Bon", "Conformité des pièces : OK", "Environnement sécurisé"];
  return (
    <div style={{ position: "absolute", inset: 0, background: BRAND.background }}>
      <Header icons={["user", "heart", "menu"]} />
      <div style={{ position: "absolute", top: 104 - scroll, left: 16, right: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, border: `1px solid ${BRAND.border}`, borderRadius: 12, padding: "6px 10px", background: "#fff" }}>
            <Icon name="chevronLeft" size={15} /> Retour
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <Icon name="share" size={19} />
            <Icon name="heart" size={19} color="#E11D48" fill="#E11D48" />
          </div>
        </div>
        <div style={{ position: "relative", marginTop: 10, borderRadius: 20, overflow: "hidden", height: 190 }}>
          <HouseThumb variant="chambreSalon" width={358} height={190} />
          <div style={{ position: "absolute", left: 10, top: 10, display: "flex", alignItems: "center", gap: 5, background: BRAND.primary, color: "#fff", fontSize: 11.5, fontWeight: 700, borderRadius: 99, padding: "4px 10px" }}>
            <Icon name="check" size={12} color="#fff" stroke={3} /> Disponible
          </div>
          <div style={{ position: "absolute", right: 10, bottom: 10, background: "rgba(15,23,42,0.6)", color: "#fff", fontSize: 11, borderRadius: 99, padding: "3px 9px" }}>1 / 5</div>
        </div>
        <div style={{ fontSize: 19, fontWeight: 800, marginTop: 12, letterSpacing: "-0.01em" }}>Chambre salon à Akpakpa</div>
        <div style={{ fontSize: 12, color: BRAND.muted, display: "flex", gap: 4, alignItems: "center", marginTop: 3 }}>
          <Icon name="mapPin" size={13} /> Akpakpa, Cotonou, Bénin
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: BRAND.primary, marginTop: 6, ...TABULAR }}>
          45 000 FCFA <span style={{ fontSize: 14 }}>/ mois</span>
        </div>
        {/* bloc vérification (maquette 04) */}
        <div style={{ marginTop: 14, background: "#fff", borderRadius: 20, padding: 14, border: `1px solid ${BRAND.border}`, boxShadow: "0 10px 26px -16px rgba(15,23,42,0.3)", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14.5, fontWeight: 800 }}>
            <Icon name="shieldCheck" size={20} color={BRAND.primary} /> Vérification de terrain certifiée VOBI
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 700, color: BRAND.primary, background: BRAND.mint, borderRadius: 99, padding: "4px 9px", border: "1px solid #BFE6D2" }}>
              <Icon name="check" size={11} color={BRAND.primary} stroke={3} /> Certifié VOBI
            </span>
            <span style={{ fontSize: 11, color: BRAND.muted }}>Audit terrain effectué</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 12 }}>
            {items.map((t, i) => {
              const c = checks(i);
              return (
                <div key={t} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600, color: c > 0.5 ? BRAND.slate900 : "#A0AEC0" }}>
                  <span
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 99,
                      background: c > 0.05 ? BRAND.emerald : "#E2E8F0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      scale: String(0.6 + 0.4 * Math.min(1, c) + 0.25 * Math.sin(Math.min(1, c) * Math.PI)),
                      boxShadow: c > 0.05 ? "0 4px 10px -3px rgba(5,150,105,0.6)" : "none",
                    }}
                  >
                    <Icon name="check" size={13} color="#fff" stroke={3.4} />
                  </span>
                  {t}
                </div>
              );
            })}
          </div>
          {/* tampon « Vérifié » */}
          {stamp > 0.01 ? (
            <div style={{ position: "absolute", right: 10, bottom: 14, rotate: "-12deg", scale: String(1 + (1 - Math.min(1, stamp)) * 1.6), opacity: Math.min(1, stamp * 1.5) }}>
              <VerifiedBadge scale={1.7} />
            </div>
          ) : null}
        </div>
      </div>
      <BottomNav active="Rechercher" />
    </div>
  );
};
