# Rad RAG - demo app

## Requirements

### PNPM

I'm using the PNPM package manager. To install follow:

https://pnpm.io/installation

then:

    cd <path-to>/rad-rag
    pnpm install

You should also create an `.env.local` file for your API keys etc., e.g.:

    cp .env.local.template .env.local

### Langchain.js

The Langchain dependencies will be added using the previous `pnpm install`.

### LangSmith (optional)

If you want to use [LangSmith](https://smith.langchain.com/) for tracing you should sign up first and add your LangChain API key to `.env.local`:

    LANGCHAIN_TRACING_V2="true"
    LANGCHAIN_API_KEY="lsv2..."

### Docker

If you do not have Docker running on your machine, ownload and install Docker Desktop first:

https://www.docker.com/products/docker-desktop/

### Supabase

The database for this application is Supabase. It will try to connect to a local instance.

Follow the guidelines on this page:

https://supabase.com/docs/guides/cli/getting-started

For more information about getting started see:

https://supabase.com/docs/guides/getting-started

After installation you can run supabase:

    `supabase start`

Then you will see a list of URL's and keys. Copy the following information to `.env.local`:

    NEXT_PUBLIC_SUPABASE_URL<API URL>
    NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key>

### OpenAI

Add your OpenAI API key to `.env.local`:

    OPENAI_API_KEY="sk-..."

### Llama3

Most routes use OpenAI, except one - in which case we use a local Llama model.
In order to use this, first install Ollama:

https://ollama.com/download

Then in the command line, install llama3:

    ollama run llama3

### Run the application

    pnpm dev

## Documentation

The application itself contains some documentation.
The diagrams being used are also available in the file `diagrams.png`.
