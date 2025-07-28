# ITO Prefilled Key API

A serverless API that fetches live data from an Airtable table and returns a list of keys. Built for deployment on Vercel.

## Overview

This API provides a simple endpoint to retrieve keys from an Airtable table in real-time. 

## API Endpoint

### GET `/api/prefilled-keys`

Returns a JSON object containing an array of keys from the specified Airtable table.

**Response:**
```json
{
  "keys": ["key1", "key2", "key3", ...]
}
```

## Setup & Deployment

1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
AIRTABLE_PAT=your_airtable_personal_access_token
AIRTABLE_BASE=your_airtable_base_id
AIRTABLE_TABLE=your_table_name
```


In Vercel project settings, add the same environment variables:
- `AIRTABLE_PAT`
- `AIRTABLE_BASE` 
- `AIRTABLE_TABLE`

## Local Development

To test locally:

```bash
npm install -g vercel 
vercel dev # to run 
```

The API will be available at `http://localhost:3000/api/prefilled-keys`


