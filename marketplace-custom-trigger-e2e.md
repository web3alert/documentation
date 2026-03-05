# Custom Marketplace Trigger — End-to-End Testing

## Architecture Overview

```
Blockchain RPC (Ethereum Mainnet via dRPC)
       │
  devourer-custom (EVM plugin)
       │
   NATS JetStream (local)     RabbitMQ (legacy, untouched)
       │                           │
   Engine (SDK handler)       Engine (legacy handler)
       │                           │
       └─────── Notifications ─────┘
```

Custom marketplace triggers use the **SDK/NATS path**, completely isolated from the legacy RabbitMQ pipeline.

## Prerequisites

- Docker and Docker Compose
- **NATS** installed locally with JetStream enabled (run with `nats-server --jetstream`)
- Node.js 20+
- The monorepo dependencies installed (`npm install` in relevant packages)

## Step 1 — Start Infrastructure

Start NATS locally (if not already running):

```bash
nats-server --jetstream
```

NATS will listen on `localhost:4222` by default.

Start Docker services (MongoDB + RabbitMQ):

```bash
cd localhost
docker compose up -d
```

This starts:
- **MongoDB** on `127.0.0.1:27017`
- **RabbitMQ** on `127.0.0.1:5672` (management on `15672`)

## Step 2 — Start Devourer (Custom Instance)

The custom devourer runs **outside Docker** using the project source code directly.

```bash
cd devourer

# Copy the custom .env into place
cp ../localhost/devourer-custom/.env .env

npm start
```

Expected startup logs should show:
- Connection to NATS at `localhost:4222`
- EVM plugin loading for project `ethereum`
- Block ingestion starting from Ethereum Mainnet RPC (`https://eth.drpc.org`)

The devourer will publish events to NATS subjects:
- `ethereum.evm.blocks`
- `ethereum.evm.events`

## Step 3 — Start API

```bash
cd api
npm start
```

Verify it's running:

```bash
curl http://localhost:3000/api/v1/health
```

## Step 4 — Register the Ethereum Source

```bash
cd localhost
./seed-sources.sh
```

This registers `ethereum` as a source in the API. Verify:

```bash
curl -s http://localhost:3000/api/v1/sources | python3 -m json.tool
```

You should see `ethereum` in the list with title "Ethereum".

## Step 5 — Start Engine with NATS

```bash
cd engine

# Use .env.example as a base (NATS_SERVERS is already configured)
cp .env.example .env

npm start
```

Engine will connect to both RabbitMQ (legacy) and NATS (SDK triggers).

## Step 6 — Start UI

```bash
cd ui
npm run dev
```

Open `http://localhost:3001` (or whichever port Next.js reports).

## Step 7 — Create a Custom Trigger via UI

1. Navigate to **Projects** and create (or open) a project
2. Click **Add Trigger**
3. Fill in the trigger wizard:
   - **Trigger type**: EVM
   - **Network**: Ethereum (populated from the registered source)
   - **Contract**: (optional) a contract address on Ethereum Mainnet
   - **Event**: (optional) event name to filter
4. Configure providers, schema, and transform as needed
5. Click **Save trigger**

## Step 8 — Verify the Saved Trigger

Check the trigger payload in MongoDB or via API:

```bash
curl -s http://localhost:3000/api/v2/triggers/<project>.<trigger-name> \
  -H "Authorization: Bearer <your-token>" | python3 -m json.tool
```

Confirm the `backend` field is:

```json
{
  "type": "sdk",
  "trigger": "ethereum.evm.events",
  "values": {
    "address": "<contract if specified>",
    "event": "<event if specified>"
  }
}
```

**NOT** `{ "type": "legacy" }`.

## Step 9 — Verify Event Flow

1. Watch engine logs — it should subscribe to the NATS subject `ethereum.evm.events`
2. Watch devourer-custom logs — it should be ingesting Ethereum Mainnet blocks and publishing events
3. When a matching event occurs, the engine processes it and produces a notification

Ethereum Mainnet produces blocks every ~12 seconds with plenty of contract events, so feedback should be quick.

## Troubleshooting

| Symptom | Check |
|---------|-------|
| Network dropdown is empty | Verify seed-sources ran successfully; check API `/sources` endpoint |
| Trigger saves with `backend.type: "legacy"` | Ensure the `network` field is filled in the wizard (SDK backend requires a network) |
| Engine doesn't receive events | Verify `NATS_SERVERS=localhost:4222` in engine `.env`; check that `nats-server` is running |
| Devourer fails to start | Check `.env` paths; ensure NATS is running (`nats-server --jetstream`) |
| Devourer can't reach RPC | dRPC may rate-limit; check `https://eth.drpc.org` availability or use an Infura/Alchemy endpoint in `config.yml` |
