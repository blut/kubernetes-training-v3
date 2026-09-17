# Modul 3: Cluster-Management, Troubleshooting und Incident Response

**Objective:** Einen realistischen Incident strukturiert analysieren, beheben und als kurze Root-Cause-Analyse dokumentieren.

## Szenario anwenden (durch Trainer:in vorbereitet)

```bash
kubectl apply -f broken-stack.yaml
kubectl get pods,svc,configmap
```

Die API ist danach nicht erreichbar. Es sind **zwei unabhängige Fehler** enthalten.

## Diagnose-Workflow

1. Überblick verschaffen:
   ```bash
   kubectl get pods,deployments,svc,configmap
   ```
2. Details und Ereignisse prüfen:
   ```bash
   kubectl describe deployment api
   kubectl describe pod <pod-name>
   kubectl get events --sort-by=.lastTimestamp
   kubectl logs <pod-name> --previous
   ```
3. Mit einem Debug-Pod die Erreichbarkeit testen:
   ```bash
   kubectl run debug --image=busybox:1.36 --rm -it --restart=Never -- \
     wget -qO- http://api/health
   ```
4. Ursachen eingrenzen und beheben:
   - Prüfen, ob der `Service`-Selector zu den Pod-Labels des `Deployment` passt.
   - Prüfen, ob der im `Deployment` referenzierte ConfigMap-Key tatsächlich in der `ConfigMap` existiert (`kubectl get configmap api-config -o yaml`).
5. Nach der Korrektur verifizieren:
   ```bash
   kubectl apply -f <korrigierte-datei>.yaml
   kubectl get pods -l app=api
   kubectl run debug --image=busybox:1.36 --rm -it --restart=Never -- \
     wget -qO- http://api/health
   ```
6. Ingress konfigurieren: [`ingress.vorlage.yaml`](ingress.vorlage.yaml) nach `ingress.yaml` kopieren, TODOs ergänzen und anwenden. Routing für `/api` und `/health` testen.

## Root-Cause-Analyse (Vorlage)

- **Auswirkung:** …
- **Ursache:** …
- **Behebung:** …
- **Präventionsmaßnahme:** …

## Build / Demonstration

Eine funktionierende, über Ingress erreichbare Kubernetes-Anwendung, ein nachvollziehbarer Diagnosepfad und ein ausgefüllter Incident-Report.

Referenzlösung: [`../../solutions/session-2/broken-stack-fixed.yaml`](../../solutions/session-2/broken-stack-fixed.yaml)
