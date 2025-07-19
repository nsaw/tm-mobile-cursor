#!/bin/bash
echo "Auditing Slack relay..."
echo "Webhook URL: https://gpt-cursor-runner.fly.dev/slack/commands"
curl -s "https://gpt-cursor-runner.fly.dev/slack/commands" -X POST -H "Content-Type: application/json" -d '{"command":"/status-runner","text":"[SLACK-AUDIT] Testing connectivity","user_name":"tm-mobile-cursor","channel_id":"infrastructure"}' | head -5
