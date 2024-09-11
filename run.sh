#!/bin/bash

set -e

sleep 10

node index.js & PID=$!

wait $PID


npm start
