# Trainingsmaterialien: Docker & Kubernetes

## Struktur

```
app/                                   Quellcode der Übungsanwendung
  api/                                 API-Service (von Teilnehmern selbst containerisiert)
  backend/                             Backend-Simulation (fertig containerisiert)
session-1-container-fundamentals/      Übungsdateien je Modul aus Session 1
session-2-kubernetes-orchestration/    Übungsdateien je Modul aus Session 2
solutions/                             Referenzlösungen für Trainer:innen
```

Dateien mit der Endung `.vorlage.yaml` bzw. `Dockerfile.vorlage` sind bewusst unvollständig (siehe `TODO`-Kommentare) und sollen von den Teilnehmenden ergänzt werden. Fertige Lösungen liegen ausschließlich unter `solutions/`.

## Setup vor dem Training (macOS)

```bash
brew install --cask docker
brew install kubectl kind
docker --version
kubectl version --client
kind version
```

Repository/Ordner an alle Teilnehmenden verteilen (z. B. als ZIP oder Git-Repo), sodass jede Gruppe eine eigene Kopie von `app/` hat.

## Die Übungsanwendung

- **API** (`app/api/server.js`): stellt `/health`, `/ready` und `/api/items` bereit, ruft dafür das Backend auf. Über die Umgebungsvariablen `BACKEND_URL`, `API_TOKEN` und `FAIL_MODE` lässt sich das Verhalten steuern (u. a. für die Self-Healing-Übungen).
- **Backend** (`app/backend/server.js`): einfacher Key-Value-Store, der Einträge in einer Datei unter `DATA_FILE` (Standard `/data/items.json`) persistiert – ideal für die Volumes-Übung.

Beide Services sind reine Node.js-Skripte ohne externe Abhängigkeiten (`node server.js` genügt), damit der Workshop ohne npm-Installation und ohne Internetzugang während des Builds funktioniert.

## Zuordnung zu den Modulen

| Ordner | Modul im Trainingsplan |
| --- | --- |
| `session-1-container-fundamentals/modul-1-dockerfiles/` | Session 1, Modul 1 |
| `session-1-container-fundamentals/modul-2-volumes-netzwerke/` | Session 1, Modul 2 |
| `session-1-container-fundamentals/modul-3-kubernetes-grundmodell/` | Session 1, Modul 3 |
| `session-2-kubernetes-orchestration/modul-1-deployments-services/` | Session 2, Modul 1 |
| `session-2-kubernetes-orchestration/modul-2-configmaps-secrets-probes/` | Session 2, Modul 2 |
| `session-2-kubernetes-orchestration/modul-3-troubleshooting-ingress/` | Session 2, Modul 3 |
