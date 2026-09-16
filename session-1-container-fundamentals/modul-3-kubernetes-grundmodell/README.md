# Modul 3: Kubernetes-Grundmodell, Cluster und erster Pod

**Objective:** Einen lokalen Kubernetes-Cluster erstellen und die Beispiel-API erstmals als Pod betreiben.

## Schritte

1. Lokalen Cluster erstellen und Grundzustand prüfen:
   ```bash
   kind create cluster --name training
   kubectl cluster-info
   kubectl get nodes
   kubectl get namespaces
   ```
2. Eigenen Namespace anlegen und als Standard-Kontext setzen:
   ```bash
   kubectl create namespace team-a
   kubectl config set-context --current --namespace=team-a
   ```
3. API-Image aus Session 1 in den Cluster laden:
   ```bash
   kind load docker-image k8s-training-api:v1 --name training
   ```
4. Pod-Manifest schreiben: Kopiere [`pod.vorlage.yaml`](pod.vorlage.yaml) nach `pod.yaml` und ersetze die `TODO`-Platzhalter (Label, Image, Port). Anschließend anwenden:
   ```bash
   kubectl apply -f pod.yaml
   ```
5. Status, Events, Labels und Logs prüfen:
   ```bash
   kubectl get pods -l app=api
   kubectl describe pod api-pod
   kubectl logs api-pod
   ```

## Build / Demonstration

Ein laufender Cluster mit eigenem Namespace und einem manuell deklarierten, gelabelten API-Pod. Erkläre den Weg vom YAML-Manifest über die Control Plane bis zum Containerprozess.

## Hinweis für Session 2

Cluster (`kind create cluster --name training`) und geladenes Image bleiben für Session 2 bestehen, sofern zwischen den Sessions nicht mehr Zeit liegt. Andernfalls Schritte 1 und 3 wiederholen.
