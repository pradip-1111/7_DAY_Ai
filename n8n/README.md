# n8n Growth Automation Workflow Documentation

## Overview
This n8n automation workflow handles automated follow-up sequences, student segmentation messaging, reminder loops, and activity tracking for the **7-Day AI Builder Challenge**.

## Architecture & Flow Diagram

```text
Registration (/api/user/register)
↓
n8n Webhook Endpoint
↓
Segment User (Beginner / Intermediate / Advanced)
↓
Generate Personalized Follow-up Message (OpenAI Node)
↓
Send Initial Challenge Welcome Message (Email / Slack / Discord / SMS)
↓
Wait (24 Hours)
↓
Check User Activity (Query Supabase / Local Progress)
↓
If Not Started: Send Encouragement Reminder
If Started: Send Day 2 Scaffolding & Tips
↓
Track Follow-Up Event in Supabase (`events` Table)
```

## Setup Instructions

1. **Import Workflow**:
   - Open your n8n instance dashboard.
   - Click **Workflows** → **Import from File**.
   - Select `n8n/workflow_sample.json`.

2. **Configure Environment Variables**:
   - Set `N8N_WEBHOOK_URL` in your Next.js `.env.local` to match your n8n webhook URL:
     ```env
     N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/registration-flow
     ```

3. **Configure Messaging Credential Credentials**:
   - Update the messaging node (SendGrid, Resend, Twilio, or Discord webhook) with your active API key credentials.

4. **Activate Workflow**:
   - Switch the workflow toggle in n8n from **Inactive** to **Active**.
