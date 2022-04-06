#!/bin/sh

PROJECT="cait-49fc0"
IMAGE="gcr.io/${PROJECT}/api"
env_vars="ENV=production,"
env_vars="${env_vars}FIREBASE_CONFIG=${FIREBASE_CONFIG},"

gcloud builds submit --tag $IMAGE
gcloud run deploy --image $IMAGE