# Modul 1: Container-Grundlagen & Dockerfiles

**Objective:** Ein bestehendes Image starten und die Beispiel-API selbst containerisieren.

## Schritte

1. Ein vorhandenes Image laden, starten und testen:
   ```bash
   docker pull nginx:alpine
   docker run -d --name nginx-test -p 8081:80 nginx:alpine
   curl http://localhost:8081
   docker stop nginx-test && docker rm nginx-test
   ```
2. Dockerfile für die API schreiben: Kopiere [`Dockerfile.vorlage`](../../app/api/Dockerfile.vorlage) nach `Dockerfile` in `app/api/` und ersetze alle `TODO`-Platzhalter.
3. Image bauen und starten:
   ```bash
   cd app/api
   docker build -t k8s-training-api:v1 .
   docker run -d --name api-test -p 8080:8080 k8s-training-api:v1
   curl http://localhost:8080/health
   ```
4. Laufzeit, Logs und Layer kurz prüfen:
   ```bash
   docker ps
   docker logs api-test
   docker history k8s-training-api:v1
   ```
5. Zusatzaufgabe: `.dockerignore` aus [`.dockerignore.vorlage`](../../app/api/.dockerignore.vorlage) übernehmen, einen nicht-root Benutzer im Dockerfile ergänzen (`USER node`) und das Image neu bauen.

## Build / Demonstration

Ein laufender API-Container aus einem selbst geschriebenen, nicht-root Dockerfile. Test mit `curl http://localhost:8080/health` sollte `ok` liefern.

## Aufräumen

```bash
docker stop api-test && docker rm api-test
```
