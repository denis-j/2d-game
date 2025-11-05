# 2D RPG Dungeon - Spielkonzept
## "Knight's Descent: Escape from the Depths"

---

## 🎮 Spielübersicht

**Genre:** 2D Top-Down Action RPG / Dungeon Crawler
**Stil:** Pixel Art, Dark Fantasy
**Perspektive:** Top-Down (Vogelperspektive)
**Spielzeit:** 30-60 Minuten pro Durchlauf (Roguelike-Elemente)

### Kernidee
Der Spieler übernimmt die Rolle eines tapferen Ritters, der in den Tiefen eines verfluchten Dungeons gefangen ist. Das Ziel ist es, durch mehrere Ebenen voller Monster, tödlicher Fallen und versteckter Schätze zu entkommen, während man stärker wird und bessere Ausrüstung findet.

---

## 🎯 Spielziele

### Hauptziel
- Erreiche die oberste Ebene des Dungeons und entkommen

### Sekundärziele
- Sammle alle drei Schlüsseltypen (Bronze, Silber, Gold)
- Maximiere deinen Münzwert
- Finde und besiege versteckte Mimic-Truhen
- Überlebe mit maximaler Gesundheit

---

## 🎲 Kern-Gameplay-Mechaniken

### 1. Bewegung & Kampf
- **WASD / Arrow Keys:** Bewegung in 4 Richtungen
- **Leertaste / Linksklick:** Nahkampfangriff mit Schwert
- **Shift:** Ausweichrolle (kurze Invulnerabilität, Cooldown 3 Sekunden)
- **E:** Interaktion mit Objekten (Truhen, Hebel, Türen)

### 2. Progressionssystem
- **Gesundheitspunkte (HP):** Start mit 100 HP, max 200 HP
- **Schadenssystem:** Unterschiedlicher Schaden je nach Ausrüstung
- **Level-Progression:** Durch Ebenen absteigend (Start: Ebene 5 → Ziel: Ebene 0)

### 3. Währungs- und Schlüsselsystem
- **Bronze-Münzen:** Wert 1 (häufig)
- **Silber-Münzen:** Wert 5 (selten)
- **Gold-Münzen:** Wert 10 (sehr selten)
- **Schlüssel:** Bronze < Silber < Gold (öffnen entsprechende Türen/Truhen)

---

## 🎭 Charaktere & Feinde

### Spieler
**Der Ritter**
- Grundschaden: 20 HP pro Schlag
- Startgeschwindigkeit: 120 Pixel/Sekunde
- Animationen: Idle, Walk (4 Richtungen), Attack

### Gegner

#### 1. **Grüner Slime** (Einfach)
- **HP:** 30
- **Schaden:** 10
- **Verhalten:** Langsame, zufällige Bewegung
- **Drop:** Bronze-Münzen (80%), Grüner Trank (5%)
- **KI:** Passive Patrouille, greift bei Kontakt an

#### 2. **Blauer Slime** (Mittel)
- **HP:** 40
- **Schaden:** 15
- **Verhalten:** Springt zum Spieler wenn nah
- **Drop:** Silber-Münzen (40%), Blauer Trank (10%)
- **KI:** Aggressiv, springt alle 2 Sekunden

#### 3. **Roter Slime** (Schwer)
- **HP:** 50
- **Schaden:** 20
- **Verhalten:** Schnelle Verfolgung
- **Drop:** Gold-Münzen (20%), Roter Trank (15%)
- **KI:** Verfolgt Spieler auf Sicht (Radius: 150 Pixel)

#### 4. **Skelett** (Elite)
- **HP:** 80
- **Schaden:** 25
- **Verhalten:** Kluge Patrouillen, blockt Angriffe (30% Chance)
- **Drop:** Schlüssel (Bronze 60%, Silber 30%, Gold 10%)
- **KI:** Patrouilliert vorgegebene Pfade, verfolgt bei Sicht

#### 5. **Fledermaus** (Schnell)
- **HP:** 20
- **Schaden:** 15
- **Verhalten:** Fliegt in Wellen, ignoriert Wände
- **Drop:** Bronze-Münzen (90%)
- **KI:** Wellenförmige Bewegung, wechselt zufällig Richtung

---

## 🧪 Items & Powerups

### Tränke
- **Roter Trank:** +30 HP Heilung
- **Grüner Trank:** +50 HP Heilung + Gift-Resistenz (10 Sek.)
- **Blauer Trank:** +20 HP + Geschwindigkeits-Boost (15 Sek.)

### Ausrüstung
- **Schwert:** Erhöht Schaden (+10 pro Upgrade)
  - Upgrades über Truhen auffindbar
  - Visueller Indikator durch Glühen

### Schlüssel
- **Bronze-Schlüssel:** Öffnet einfache Türen und kleine Truhen
- **Silber-Schlüssel:** Öffnet mittlere Türen und große Truhen
- **Gold-Schlüssel:** Öffnet Boss-Räume und Schatzkammern

---

## 🪤 Fallen-System

### 1. **Pfeiffalle**
- Feuert horizontale Pfeile
- Schaden: 20 HP
- Intervall: 3 Sekunden
- Erkennbar: Kurzes Aufleuchten vor Auslösung

### 2. **Feuerfalle**
- Flammenstrahl aus Wand/Boden
- Schaden: 15 HP/Sekunde (DoT)
- Pattern: 2 Sek. an, 4 Sek. aus

### 3. **Giftfalle**
- Giftgas-Projektion
- Schaden: 10 HP + 5 HP/Sek. (5 Sekunden Gift)
- Visuell: Grüner Nebel

### 4. **Stachelfalle**
- Stacheln aus dem Boden
- Schaden: 25 HP (einmalig bei Betreten)
- Pattern: 1 Sek. aktiviert, 3 Sek. deaktiviert

### 5. **Stachelgatter**
- Blockiert Weg, kann per Hebel gesteuert werden
- Schaden: 40 HP bei Kontakt
- Permanent, bis Hebel betätigt

---

## 🗺️ Level-Design

### Dungeon-Struktur (5 Ebenen + Ausgang)

#### **Ebene 5: Die vergessenen Zellen** (Start)
- **Größe:** Klein (20x15 Tiles)
- **Gegner:** Grüne Slimes (3-4), Fledermäuse (2)
- **Fallen:** Keine
- **Besonderheiten:** Tutorial-Bereich, erste Truhe mit Schwert
- **Atmosphäre:** Dunkle Zellen, Knochen, Fackeln

#### **Ebene 4: Die Katakomben**
- **Größe:** Mittel (25x20 Tiles)
- **Gegner:** Grüne + Blaue Slimes (5-6), Skelette (1-2)
- **Fallen:** Stachelfallen (3-4)
- **Besonderheiten:** Erste verschlossene Türen, Hebel-Puzzle
- **Atmosphäre:** Lange Gänge, Gräber, Ketten

#### **Ebene 3: Die Fallenkorridore**
- **Größe:** Mittel (30x20 Tiles)
- **Gegner:** Alle Slime-Typen, Skelette (2-3)
- **Fallen:** Pfeifallen (4), Feuerfallen (3), Stacheln (5)
- **Besonderheiten:** Mimic-Truhe (1), versteckte Schatzkammer
- **Atmosphäre:** Enge Gänge, viele Fallen, düster

#### **Ebene 2: Die Skelett-Hallen**
- **Größe:** Groß (35x25 Tiles)
- **Gegner:** Skelette (5-7), Rote Slimes (2-3), Fledermäuse (4)
- **Fallen:** Alle Typen gemischt
- **Besonderheiten:** Multi-Raum-Puzzle mit mehreren Hebeln
- **Atmosphäre:** Große Hallen, Säulen, epischer Look

#### **Ebene 1: Der Thronraum des Fluches**
- **Größe:** Boss-Arena (25x25 Tiles)
- **Gegner:** Elite-Skelette (3) + kontinuierliche Spawn-Wellen
- **Fallen:** Ringförmige Feuerfallen
- **Besonderheiten:** Boss-Kampf-Mechanik, alle Schlüssel benötigt
- **Atmosphäre:** Zerstörter Thronraum, dramatisch

#### **Ebene 0: Der Ausgang**
- **Größe:** Klein (15x15 Tiles)
- **Gegner:** Keine
- **Besonderheiten:** Flucht-Sequenz, Dungeon kollabiert (Timer: 30 Sekunden)
- **Atmosphäre:** Licht am Ende, fallende Steine

---

## 🎨 Visuelle Elemente

### UI/HUD
- **Obere linke Ecke:** HP-Anzeige (Herzen oder Bar)
- **Obere rechte Ecke:** Münz-Counter
- **Unterer Bildschirm:** Inventar-Slots (Tränke, Schlüssel)
- **Minimap:** Optional in der Ecke
- **Dungeon-Ebenen-Anzeige:** Zeigt aktuelle Ebene

### Licht & Schatten
- Fackeln werfen dynamisches Licht
- Spieler hat kleinen Licht-Radius
- Dunkle Bereiche außerhalb des Sichtfeldes

### Partikeleffekte
- Münzen glitzern
- Fallen warnen vor Aktivierung
- Treffer-Effekte (Blut, Schlag-Impact)
- Tränke-Effekte (Heilungs-Partikel)

---

## 🔊 Audio-Konzept

### Musik
- **Ebenen 5-4:** Düstere, ruhige Ambience
- **Ebenen 3-2:** Spannungs-steigernde Loops
- **Ebene 1 (Boss):** Epischer Kampf-Track
- **Ebene 0 (Flucht):** Hektischer, dringlicher Track

### Sound-Effekte
- Schritte des Ritters (Stein-Klang)
- Schwert-Schwingen und Treffer
- Fallen-Aktivierung (Klicken, Zischen)
- Monster-Sounds (Slime-Glucksen, Skelett-Knochen-Klappern)
- Item-Sammeln (Münzen-Klingeln, Trank-Pop)
- Türen öffnen (knarzend)
- Hebel umlegen (mechanisch)

---

## 🎯 Schwierigkeitsgrad-Optionen

### Normal-Modus
- Standardwerte wie oben beschrieben
- Gesundheits-Drops: Häufig

### Hard-Modus
- Gegner-HP +50%
- Spieler-Schaden -25%
- Gesundheits-Drops: Selten
- Permadeath: Zurück zu Ebene 5

### Endless-Modus (Post-Game)
- Nach Durchlauf freischaltbar
- Prozedural generierte Ebenen
- Steigender Schwierigkeitsgrad
- Highscore-System

---

## 🏆 Erfolge & Wiederspielwert

### Erfolge
1. **Erste Schritte:** Verlasse Ebene 5
2. **Schatzjäger:** Sammle 500 Münzen
3. **Fallen-Meister:** Überlebe ohne Fallenschaden
4. **Schlüsselmeister:** Finde alle 3 Gold-Schlüssel
5. **Unbesiegbar:** Beende das Spiel ohne zu sterben
6. **Mimic-Jäger:** Finde und besiege 3 Mimic-Truhen
7. **Speedrunner:** Beende das Spiel in unter 20 Minuten
8. **Sammler:** Öffne alle Truhen in einem Durchlauf

### Unlocks
- **Skins:** Alternative Ritter-Farben
- **Modifiers:** Große Kopf-Modus, Unendlich-Sprint
- **Concept Art:** Freischaltbare Galerie

---

## 📱 Technische Spezifikationen

### Engine & Framework
- **Engine:** Phaser 3 (bereits im Projekt vorhanden)
- **Sprache:** TypeScript
- **Auflösung:** 800x600 Pixel (skalierbar)
- **Framerate:** 60 FPS
- **Tile-Größe:** 16x16 Pixel

### Asset-Verwendung
```
/public/assets/dungeon-tileset-asset-pack/
├── 1x/ (Standard-Auflösung)
├── 2x/ (HD-Displays)
└── 3x/ (Retina-Displays)
```

### Performance-Ziele
- Ladezeit: < 5 Sekunden
- Keine Frame-Drops bei 20+ Entities
- Flüssige Animationen (60 FPS)

---

## 🎬 Entwicklungs-Roadmap

### Phase 1: Grundlagen (Woche 1-2)
- ✅ Projekt-Setup (bereits erledigt)
- ✅ Asset-Integration (bereits erledigt)
- Spieler-Bewegung & Animation
- Kamera-System
- Kollisions-Erkennung

### Phase 2: Kern-Gameplay (Woche 3-4)
- Kampfsystem implementieren
- Gegner-KI (alle 5 Typen)
- Item-System (Tränke, Münzen, Schlüssel)
- Truhen & Interaktionen

### Phase 3: Level & Fallen (Woche 5-6)
- Tilemap-System
- Alle 6 Ebenen designen
- Fallen-Mechaniken
- Türen & Hebel-Puzzles

### Phase 4: Polish & Audio (Woche 7)
- UI/HUD Implementation
- Sound-Effekte
- Musik-Integration
- Partikel-Effekte

### Phase 5: Testing & Balance (Woche 8)
- Schwierigkeits-Balancing
- Bug-Fixes
- Performance-Optimierung
- Playtesting

---

## 🎮 Kontroller-Support

### Tastatur (Standard)
- **WASD / Arrow Keys:** Bewegung
- **Space:** Angriff
- **E:** Interaktion
- **Shift:** Ausweichrollen
- **ESC:** Pause-Menü
- **Tab:** Inventar
- **M:** Karte

### Gamepad (Optional)
- **Left Stick:** Bewegung
- **A / Cross:** Angriff
- **B / Circle:** Ausweichrollen
- **X / Square:** Interaktion
- **Start:** Pause
- **Select:** Karte

---

## 📊 Monetarisierung (Optional)

Falls gewünscht:
- **Free-to-Play:** Mit optionalen Cosmetics
- **Premium:** $4.99 (einmalig, alle Features)
- **Keine Pay-to-Win Mechaniken**

---

## 🌟 Unique Selling Points

1. **Komplett mit vorhandenen Assets umsetzbar**
2. **Klassisches Dungeon-Crawler-Feeling**
3. **Roguelike-Elemente für Wiederspielwert**
4. **Faire Challenge ohne Frustration**
5. **Pixel-Art Ästhetik mit modernem Gameplay**
6. **Schnelle Spiel-Sessions (Pick-up-and-play)**

---

## 🎭 Story (Optional)

> *"Einst war ich der tapferste Ritter des Königreichs. Doch ein verfluchter Auftrag führte mich in diesen verdammten Dungeon. Die Tür schloss sich hinter mir, und die Dunkelheit verschlang das Licht. Jetzt kämpfe ich nicht mehr für Ehre oder Ruhm – ich kämpfe ums Überleben. Mit jedem Schritt nach oben komme ich der Freiheit näher. Die Monster, die Fallen, der Fluch – nichts wird mich aufhalten. Ich WERDE entkommen."*

---

**Ende des Konzepts**

Dieses Konzept nutzt alle verfügbaren Assets optimal und bietet ein vollständiges, spielbares 2D RPG Dungeon-Erlebnis mit hohem Wiederspielwert!
