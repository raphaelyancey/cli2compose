const assert = require('assert');
const cli2compose = require('../src/index.js');

describe('cli2compose', function() {
  
  it('should throw if input is not an array or a string', function() {
    assert.throws(() => {
      cli2compose(1);
    });
    assert.throws(() => {
      cli2compose({});
    });
    assert.throws(() => {
      cli2compose(function() {});
    });
  });

  it('volumes', function() {

    input = "docker run -v /myvolume --volume ./data:/my/second/volume -v ./ro:/a/read/only/volume:ro --volume ./data/foobar.txt:/also/a/file.txt ./ myimage";
    output = cli2compose(input);
    expected = 

`version: "2"
services:
  app:
    image: ./
    command: myimage
    volumes:
      - /myvolume
      - ./data:/my/second/volume
      - ./ro:/a/read/only/volume:ro
      - ./data/foobar.txt:/also/a/file.txt
`;

    assert.equal(output, expected);
  });

it('environment variables', function() {

    input = 'docker run -e FOO=simple --env FOO2="with space" -e EMPTY_VAR myimage';
    output = cli2compose(input);
    expected = 

`version: "2"
services:
  app:
    image: myimage
    environment:
      - FOO=simple
      - FOO2=with space
      - EMPTY_VAR
`;

    assert.equal(output, expected);

  });

it('publish ports', function() {

    input = 'docker run -p 80 -p "80-90" -p 81:81 --publish "82-84" -p "82-84:82-84" -p "82-84" -p "127.0.0.1:8001:8001" --publish 127.0.0.1:5000-5010:5000-501 -p 6060:6060/udp myimage';
    output = cli2compose(input);
    expected = 

`version: "2"
services:
  app:
    image: myimage
    ports:
      - "80"
      - 80-90
      - 81:81
      - 82-84
      - 82-84:82-84
      - 82-84
      - 127.0.0.1:8001:8001
      - 127.0.0.1:5000-5010:5000-501
      - 6060:6060/udp
`;

    assert.equal(output, expected);

  });

it('expose ports', function() {

    input = 'docker run --expose 80 --expose 81 myimage';
    output = cli2compose(input);
    expected = 

`version: "2"
services:
  app:
    image: myimage
    expose:
      - "80"
      - "81"
`;

    assert.equal(output, expected);

  });

it('container name', function() {

    input = 'docker run --name foobar_container myimage';
    output = cli2compose(input);
    expected = 

`version: "2"
services:
  app:
    image: myimage
    container_name: foobar_container
`;

    assert.equal(output, expected);

  });

it('restart', function() {

    input = 'docker run --restart no myimage';
    output = cli2compose(input);
    expected = 

`version: "2"
services:
  app:
    image: myimage
    restart: no
`;

    assert.equal(output, expected);

  });

it('networks', function() {

    input = 'docker run --network firstnet --net secondnet myimage';
    output = cli2compose(input);
    expected = 

`version: "2"
services:
  app:
    image: myimage
    networks:
      - firstnet
      - secondnet
`;

    assert.equal(output, expected);

  });

it('links', function() {

    input = 'docker run --link firstlink --link secondlink myimage';
    output = cli2compose(input);
    expected = 

`version: "2"
services:
  app:
    image: myimage
    links:
      - firstlink
      - secondlink
`;

    assert.equal(output, expected);

  });

it('multiline + various options', function() {

    input = "docker create \
--name=nginx \
-e PUID=1000 \
-e PGID=1000 \
-e TZ=Europe/London \
-p 80:80 \
-p 443:443 \
-v /path/to/appdata/config:/config \
--restart unless-stopped \
linuxserver/nginx";
    output = cli2compose(input);
    expected = 

`version: "2"
services:
  app:
    image: linuxserver/nginx
    container_name: nginx
    environment:
      - PUID=1000
      - PGID=1000
      - TZ=Europe/London
    ports:
      - 80:80
      - 443:443
    volumes:
      - /path/to/appdata/config:/config
    restart: unless-stopped
`;

    assert.equal(output, expected);

  });
});
