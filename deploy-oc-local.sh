#!/bin/bash
SCRIPT=`realpath $0`
SCRIPTPATH=`dirname $SCRIPT`
CURRENTPATH=`pwd`

GREEN='\033[0;32m'
NC='\033[0m'

OCDOCKERREPO=172.30.1.1:5000

if ! [ -x "$(command -v node)" ]; then
  echo -e 'Error: ${GREEN}node.js${NC} is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v npm)" ]; then
  echo -e 'Error: ${GREEN}npm${NC} is not installed.' >&2
  exit 1
fi

if ! [ -x "$(command -v oc)" ]; then
  echo -e "Error: ${GREEN}oc${NC} must be available via the PATH environment variable." >&2
  exit 1
fi

OCSTATUS="$(oc cluster status)"
if [ "$OCSTATUS" = "Error: OpenShift cluster is not running" ]; then
  echo -e "Error: ${GREEN}Openshift cluster${NC} does not appear to be running." >&2
  exit 1
fi

cd $SCRIPTPATH

echo -e "Building ${GREEN}portal${NC} container from ${GREEN}$PWD${NC}"
npm run build
docker build -t portal .
echo -e "Deploying ${GREEN}portal${NC} container to Openshift"
docker tag portal $OCDOCKERREPO/loquacious/portal
docker push $OCDOCKERREPO/loquacious/portal

cd $CURRENTPATH

exit 0
