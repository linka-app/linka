<img src="https://raw.githubusercontent.com/cmsax/linka/main/public/logo192.png" width="150">

# Linka!

A smooth bookmarks management web app, shipped with special optimization for quick-search & quick-open, which will boost your productivity.

Currently it supports `linkding`, we are planning to make `Linka` a more flexible app to support other popular backends.

- [Linka!](#linka)
  - [Features](#features)
  - [Demo](#demo)
  - [How-To use](#how-to-use)
    - [Hotkeys](#hotkeys)
  - [Backend Prerequisite](#backend-prerequisite)
  - [Development Guide](#development-guide)
    - [Prerequisite](#prerequisite)
    - [Start a local development app](#start-a-local-development-app)
  - [Deployment Guide](#deployment-guide)
    - [Option 1: Deploy With Static HTTP Server (e.g. Nginx)](#option-1-deploy-with-static-http-server-eg-nginx)
    - [Option 2: Deploy with Docker](#option-2-deploy-with-docker)

## About the Logo

❤️ The logo was copied from the project [Benthos](https://www.benthos.dev/) in this [commit](https://github.com/linka-app/linka/commit/2521264d1e6cbb166066d1d3ad42908daf7c356a).

## Features

- full text search
- multi keywords, substract keywords support
- instantly open search results
- search on type
- dark/light mode
- hotkeys

## Demo

![demo](./screenshot/demo.gif)

- [Stable Version](https://linka.unoiou.com)
- [Development Version](https://linka-git-dev-cmsax.vercel.app/)

Following configs are for testing:

- `demo linkding base url`: https://link.unoiou.com
- `demo token`(restricted): `a6816f654f87197545cd66bfd2f8e294c40f1ee4`

## How-To use

- type any keywords, seperated by space, results will be **intersection**
- use keywords start with `!` to **exclude**
- type `Enter` to open search results in new tabs

### Hotkeys

- `cmd+l` or `ctrl+l` to focus on the search box
- `cmd+Down Arrow` or `ctrl+Down Arrow` / `cmd+Down Arrow` or `ctrl+Down Arrow` to navigate the results
- `cmd+Enter` or `ctrl+Enter` with an item selected to open it as a new tab or open all bookmarks when no item is selected

## Backend Prerequisite

Currently, this app only supports the "linkding" backend. However, our plan is to make Linka a backend-dependent app.

To ensure compatibility with Linka, the backend service must enable "Cross-Origin Resource Sharing" (CORS).

You can nable `CORS` in backend by adding following headers to HTTP response:

- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET,POST,OPTIONS,PUT,DELETE`
- `Access-Control-Allow-Headers: *`
- `Access-Control-Max-Age: 1000000`

## Development Guide

### Prerequisite

Install `nodejs` and `yarn`.

### Start a local development app

Run `yarn install` & `yarn dev` to start up.

## Deployment Guide

### Option 1: Deploy With Static HTTP Server (e.g. Nginx)

Run `yarn build` then publish the `./build` directory to a static http server like nginx, following is a demo nginx config part:

```config
# linka
server {
    listen 443 ssl http2;
    server_name linka.unoiou.com;
    index index.html;
    location / {
        root /home/ubuntu/static_sites/linka/build;
        try_files $uri $uri/ /index.html;
    }
}
```

### Option 2: Deploy with Docker

Use pre build image:

```bash
docker pull cmsax/linka:latest
docker run --name my-own-linka -p 80:80 -d cmsax/linka:latest
```

Build on your own:

```bash
docker build -t my/linka:latest .
docker run --name my-own-linka -p 80:80 -d my/linka:latest
```
