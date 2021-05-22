#!/bin/bash

# Build and push docker image, and optionally save it

set -o errexit  # exit if command fails

# Command line argument processing
TAG_AND_PUSH=""     # When set, the image will be tagged for deployment and
                    # pushed

FORCE_BUILD=""      # When set, the script will build in the presence of
                    # uncommited local changes

for arg in "$@"
do
    case $arg in
        -t|--TAG_AND_PUSH)
        TAG_AND_PUSH="Y"
        ;;
        -f|--force)
        FORCE_BUILD="Y"
        ;;
        *) # unknown
        ;;
    esac
    shift # past argument or value
done

echo "Version:" && read -r version

if [ -z "${FORCE_BUILD}" ]
then
    git diff --quiet || \
        ( echo "Stopping due to uncommitted work - use --force to override";
            exit 1 )
fi

docker image build . --no-cache -t "$(whoami)/projects-scanner:$version"

if [ -n "${TAG_AND_PUSH}" ]
then
    echo "Tagging for production and saving"
    docker image tag "$(whoami)/projects-scanner:$version" "eu.gcr.io/bu-fyp-s5008913/projects-scanner:$version"
    docker push "eu.gcr.io/bu-fyp-s5008913/projects-scanner:$version"
fi