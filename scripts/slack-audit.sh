#!/bin/{ { { { bash
echo "Auditing Slack relay..." & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown
echo "Webhook URL: https://gpt-cursor-runner.fly.dev/slack/commands"
{ { { { curl -s "https://gpt-cursor-runner.fly.dev/slack/commands" -X POST -H "Content-Type: application/json" -d '{"command":"/status-runner","text":"[SLACK-AUDIT] Testing connectivity","user_name":"tm-mobile-cursor","channel_id":"infrastructure" & &  & } >/dev/null 2>&1 & disown & } >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown} >/dev/null 2>&1 & disown}' | head -5
