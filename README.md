![npm](https://img.shields.io/npm/v/cli2compose.svg) ![CircleCI](https://img.shields.io/circleci/build/github/raphaelyancey/cli2compose/master.svg)

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

## Quick start

```bash
npx -q cli2compose docker run mariadb > docker-compose.yml
```

... or through the [web ui](https://raphaelyancey.github.com/cli2compose)!

## Usage

### CLI

```bash
npx -q cli2compose docker run mariadb > docker-compose.yml
```

### Node.js

```javascript
const cli2compose = require('cli2compose');
const yaml = cli2compose('docker run mariadb');
console.log(yaml);
```

### Browser

```html
<script src="https://unpkg.com/cli2compose"></script>
<script>
    console.log(cli2compose('docker run mariadb'));
</script>
```

## Supported input options

```bash
docker [create|run] [--volume|-v]
                    [--publish|-p]
                    [--network|--net]
                    [--restart]
                    [--expose]
                    [--env|-e]
                    [--links]
                    [--name] image [command]
```
