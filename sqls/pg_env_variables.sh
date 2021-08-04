#!/bin/bash
echo exporting postgres env variables
export PGUSER="postgres"
export PGHOST="host.docker.internal"
export PGDATABASE="product"
export PGPASSWORD="changeme"
export PGPORT="5432"