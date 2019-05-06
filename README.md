# cli2compose

Translates

```bash
docker create \
  --name=nextcloud \
  -e PUID=1000 \
  -e PGID=1000 \
  -e TZ=Europe/London \
  -p 443:443 \
  -v :/config \
  -v :/data \
  --restart unless-stopped \
  linuxserver/nextcloud
```

into

```yaml
version: "2"
services:
  app:
    image: linuxserver/nextcloud
    container_name: nextcloud
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/London
    ports:
      - 443:443
    volumes:
      - :/config
      - :/data
    restart: unless-stopped
```

## Installation

```bash
npm i -g cli2compose
```

## Usage

Just prepend `cli2compose` to your docker command line.

```bash
cli2compose docker run [...]
```