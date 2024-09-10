#!/bin/bash

set -e

node index.js & PID=$!

wait $PID