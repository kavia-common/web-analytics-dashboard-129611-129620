#!/bin/bash
cd /home/kavia/workspace/code-generation/web-analytics-dashboard-129611-129620/frontend_analytics_dashboard
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

