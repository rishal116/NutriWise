#!/bin/bash

echo "🚀 Starting backend..."
(cd backend && npm run dev) 2>&1 | sed 's/^/[BACKEND] /' &

echo "🚀 Starting frontend..."
(cd frontend && npm run dev) 2>&1 | sed 's/^/[FRONTEND] /' &

wait