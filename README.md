# Plutus (Expense Tracker)

`Plutus` is a modern UI for tracking / monitoring personal expenses.

## Installation

### Set Environment variables

There are a couple of required environment variables, most notably the `API_URL`. First, set the value to point to a running instance of the backen api.

### NPM

The project is built using `Nextjs` and thus can simply be installed using `npm`:

```script
npm i
```

Then to run the development server simply run:

```script
npm run dev
```

### Docker

Alternatively, build and run the docker image.

```bash
cd plutus/
docker build -f Dockerfile -t plutus:dev .
```

```bash
docker -p 3000:3000 run plutus:dev
```

Then open your browser to `http://localhost:3000`.
