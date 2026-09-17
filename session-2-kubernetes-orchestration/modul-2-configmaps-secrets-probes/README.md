# Modul 2: ConfigMaps, Secrets, Probes und Self-Healing

**Objective:** Die API um umgebungsabhängige Konfiguration und belastbare Healthchecks ergänzen.

## Schritte

1. ConfigMap und Secret anwenden (Secret-Vorlage vorher mit `base64` befüllen):
   ```bash
   echo -n "trainings-token-123" | base64
   # Ergebnis in secret.vorlage.yaml eintragen, dann als secret.yaml speichern
   kubectl apply -f configmap.yaml
   kubectl apply -f secret.yaml
   ```
2. Deployment-Vorlage [`deployment.vorlage.yaml`](deployment.vorlage.yaml) nach `deployment.yaml` kopieren, TODOs ergänzen (Image, `envFrom`/`env`, Probes) und anwenden:
   ```bash
   kubectl apply -f deployment.yaml
   kubectl get pods -l app=api
   ```
3. Probes testen:
   ```bash
   kubectl exec deploy/api -- printenv API_TOKEN
   curl -H "x-api-token: trainings-token-123" http://<service>/api/items
   ```
4. Self-Healing simulieren: Deployment mit `FAIL_MODE=unready` bzw. `FAIL_MODE=crash` patchen und beobachten:
   ```bash
   kubectl set env deployment/api FAIL_MODE=unready
   kubectl get pods -l app=api -w   # Pod wird "not ready", verschwindet aus dem Service
   kubectl set env deployment/api FAIL_MODE=crash CRASH_AFTER_MS=15000
   kubectl get pods -l app=api -w   # Pod wird nach Crash neu gestartet (Restarts-Zähler steigt)
   kubectl set env deployment/api FAIL_MODE-   # Fehlerzustand wieder aufheben
   ```
5. Probe-Timing anpassen (`periodSeconds`, `failureThreshold` in `deployment.yaml`) und den Effekt auf die Restart-Geschwindigkeit vergleichen.

## Build / Demonstration

Ein konfigurierbares Deployment, das nur bereite Pods bedient, einen simulierten Containerfehler selbstständig behandelt und dessen Probe-Timing nachvollziehbar eingestellt ist.
