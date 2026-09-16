# Modul 2: Volumes, Netzwerke und Container-Kommunikation

**Objective:** API und Backend über ein benanntes Docker-Netzwerk verbinden und Daten über einen Volume-Neustart hinweg erhalten.

## Voraussetzung

API-Image aus Modul 1 (`k8s-training-api:v1`) muss vorhanden sein. Backend-Image bauen:

```bash
cd app/backend
docker build -t k8s-training-backend:v1 .
```

## Schritte

1. Benanntes Netzwerk und Backend-Container mit Volume anlegen:
   ```bash
   docker network create training-net
   docker volume create backend-data
   docker run -d --name backend --network training-net \
     -v backend-data:/data k8s-training-backend:v1
   ```
2. API im selben Netzwerk starten und auf das Backend über den Containernamen verweisen:
   ```bash
   docker run -d --name api --network training-net -p 8080:8080 \
     -e BACKEND_URL=http://backend:9090 k8s-training-api:v1
   curl http://localhost:8080/ready
   ```
3. Datensatz schreiben, API-Container entfernen und mit demselben Volume neu starten:
   ```bash
   # Hinweis: "backend" ist nur innerhalb von training-net auflösbar, nicht vom Host aus.
   # Daher einen temporären curl-Container im selben Netzwerk verwenden:
   docker run --rm --network training-net curlimages/curl:8.11.0 \
     -X POST -H 'Content-Type: application/json' \
     -d '{"text":"erster Eintrag"}' http://backend:9090/items
   docker stop api && docker rm api
   docker run -d --name api --network training-net -p 8080:8080 \
     -e BACKEND_URL=http://backend:9090 k8s-training-api:v1
   curl http://localhost:8080/api/items
   ```
4. Absichtlichen Fehler diagnostizieren: API stattdessen mit `BACKEND_URL=http://localhost:9090` starten und beobachten, dass `/ready` fehlschlägt (kein Backend auf `localhost` im eigenen Container-Netz-Namespace).
5. Netzwerkgrenzen zeigen: Backend-Container aus dem Netzwerk trennen und erneut testen:
   ```bash
   docker network disconnect training-net backend
   curl http://localhost:8080/ready   # sollte jetzt fehlschlagen
   ```

## Build / Demonstration

Ein funktionierender API-zu-Backend-Datenfluss, persistente Daten nach Container-Neustart und eine dokumentierte Netzwerkdiagnose inklusive Fehlerfall.

## Aufräumen

```bash
docker rm -f api backend
docker network rm training-net
docker volume rm backend-data
```
