# Modul 1: Deployments, Services und Skalierung

**Objective:** Die API als skalierbares Deployment betreiben und über einen stabilen Service erreichbar machen.

## Schritte

1. Deployment-Manifest schreiben: Kopiere [`deployment.vorlage.yaml`](deployment.vorlage.yaml) nach `deployment.yaml`, ersetze die `TODO`-Platzhalter (2 Replicas, Label, Image) und wende es an:
   ```bash
   kubectl apply -f deployment.yaml
   kubectl get deployments,pods -l app=api
   ```
2. ClusterIP-Service anlegen: Kopiere [`service.vorlage.yaml`](service.vorlage.yaml) nach `service.yaml`, ergänze die TODOs und wende es an. Aus einem Debug-Pod testen:
   ```bash
   kubectl apply -f service.yaml
   kubectl run debug --image=busybox:1.36 --rm -it --restart=Never -- \
     wget -qO- http://api/health
   ```
3. Service testweise auf `NodePort` umstellen und direkt aufrufen:
   ```bash
   kubectl patch service api -p '{"spec": {"type": "NodePort"}}'
   kubectl get service api
   # Node-Port aus der Ausgabe (30000-32767) mit curl gegen die kind-Node testen
   ```
   Im Plenum diskutieren: Unterschied zu `LoadBalancer` (externer Cloud-Load-Balancer, in `kind` nicht nativ verfügbar).
4. Skalieren und Self-Healing beobachten:
   ```bash
   kubectl scale deployment api --replicas=3
   kubectl get pods -l app=api -w
   kubectl delete pod <einen-pod-namen>
   ```
5. Rollout und Rollback:
   ```bash
   kubectl set image deployment/api api=k8s-training-api:v2
   kubectl rollout status deployment/api
   kubectl rollout undo deployment/api
   ```

## Build / Demonstration

Eine intern und über `NodePort` erreichbare, replizierte API mit beobachtbarem Rollout und nachgewiesenem Self-Healing bei Pod-Löschung.
