#!/bin/bash

# Deploy PhotoShare to Kubernetes
echo "Deploying PhotoShare to Kubernetes..."

# Create namespace
kubectl apply -f namespace.yaml

# Create configmap and secrets
kubectl apply -f configmap.yaml
kubectl apply -f secret.yaml

# Create persistent volume
kubectl apply -f persistent-volume.yaml

# Deploy application
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl apply -f ingress.yaml
kubectl apply -f hpa.yaml

echo "Deployment complete!"
echo "Check status with: kubectl get pods -n photoshare"
echo "View logs with: kubectl logs -f deployment/photoshare-app -n photoshare"