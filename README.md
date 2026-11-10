# Myo

Training, Ernährung und Fortschritt als installierbare Web-App (PWA).

## Aufbau
- `index.html`: die komplette App 
- `config.js`: Supabase-URL und öffentlicher Key für Login und Sync
- `sw.js`: Offline-Betrieb
- `manifest.webmanifest`, `icons/`: App-Name, Farben und Icons

## Installieren (Android)
1. Seite in Chrome öffnen: `https://<benutzername>.github.io/myo/`
2. Menü (⋮) → **App installieren** bzw. **Zum Startbildschirm hinzufügen**

## Daten
Die Trainingsdaten liegen nicht in diesem Repository, sondern im eigenen Supabase-Projekt
(Tabelle `myo_docs`, jeder Nutzer sieht nur seine eigenen Zeilen) und als Kopie auf dem Gerät.
