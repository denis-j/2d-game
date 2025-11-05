# 2D Game

Ein einfaches 2D-Plattform-Spiel, entwickelt mit TypeScript und HTML5 Canvas.

## Features

- **TypeScript**: Typsicherer Code für bessere Wartbarkeit
- **Vite**: Schneller Build-Prozess und Hot Module Replacement
- **HTML5 Canvas**: Native 2D-Grafik-Rendering
- **Plattform-Mechanik**: Springen und Laufen auf verschiedenen Plattformen
- **Score-System**: Automatische Punktevergabe über die Zeit

## Projektstruktur

```
2d-game/
├── src/
│   ├── game/
│   │   ├── Game.ts      # Haupt-Spiel-Logik
│   │   ├── Player.ts    # Spieler-Klasse mit Bewegung und Kollision
│   │   └── Platform.ts  # Plattform-Klasse
│   └── main.ts          # Entry Point
├── public/              # Statische Assets
├── index.html           # HTML Entry Point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Installation

1. Abhängigkeiten installieren:
```bash
npm install
```

## Entwicklung

Development-Server starten:
```bash
npm run dev
```

Der Server läuft dann auf `http://localhost:3000`

## Build

Produktions-Build erstellen:
```bash
npm run build
```

Die Build-Dateien werden im `dist/` Ordner erstellt.

## Vorschau des Builds

Build lokal testen:
```bash
npm run preview
```

## Steuerung

- **Pfeiltasten Links/Rechts** oder **A/D**: Spieler bewegen
- **Pfeiltaste Hoch** oder **W** oder **Leertaste**: Springen

## Spielmechanik

- Der Spieler (blauer Block) kann sich bewegen und springen
- Spring auf die roten Plattformen
- Der Score erhöht sich automatisch über die Zeit
- Schwerkraft und realistische Physik

## Erweiterungsmöglichkeiten

- Gegner hinzufügen
- Power-Ups implementieren
- Level-System
- Münzen zum Sammeln
- Sound-Effekte
- Animationen
- Mehrere Level
- Highscore-System

## Technologie-Stack

- **TypeScript**: ^5.3.3
- **Vite**: ^5.0.8
- **HTML5 Canvas API**: Für 2D-Rendering

## Lizenz

MIT
