
# Oil &amp; Rope Tabletop

[![Node Version](https://img.shields.io/badge/Node-16.x+-green.svg)](https://nodejs.org/en/download/)
[![Docker](https://img.shields.io/badge/Docker-latest-blue.svg)](https://docs.docker.com/get-docker/)
![CI/CD Status](https://github.com/oil-rope/oilandrope-tabletop/actions/workflows/node.yml/badge.svg)
[![Coverage](https://codecov.io/gh/oil-rope/oilandrope-tabletop/branch/develop/graph/badge.svg)](https://app.codecov.io/gh/oil-rope/oilandrope-tabletop/tree/develop/)

[React](https://reactjs.org/) project which manages the visual and
interactive part of Oil &amp; Rope, which includes a chat and the
tabletop itself.

- [Oil &amp; Rope Tabletop](#oil--rope-tabletop)
  - [Installation](#installation)
    - [QuickStart](#quickstart)
    - [Backend](#backend)
      - [From Project](#from-project)
      - [Create admin user](#create-admin-user)
    - [Frontend](#frontend)

## Installation

In order to have the full project working you'll need to either bypass
the login system and mock fetch responses **or the easy way** by
setting up the backend and frontend as separate projects.  
Let's do the easy way.

### QuickStart

1. Install [Docker](https://docs.docker.com/get-docker/).
2. Run the command below.
3. Run `docker run -ti oar_core poetry run ./manage.py createsuperuser`.
   1. Set username, email and password.
4. Access [localhost:8000](http://localhost:8000).
5. Run `npm i -D`
6. Run `npm start`
7. Access [localhost:8080](http://localhost:8080).

```bash
# Execute this command to setup the backend as Docker container

docker run \
--tty --interactive \
--env=DJANGO_SETTINGS=oilandrope.dev_settings \
--env=GUNICORN_WORKERS=1 \
--publish=127.0.0.1:8000:8000 \
--name=oar_core \
oilandrope/core:develop
```

### Backend

In order to start development you'll need
[node 16.x or superior](https://nodejs.org/en/download/) and probably a
copy of the
[Oil &amp; Rope Project](https://github.com/oil-rope/oil-and-rope/)
either running directly from virtual environment or using
[Docker](https://hub.docker.com/r/oilandrope/core).

#### From Project

If you want a to control and debug everything you can set up the backend
directly from the
[GitHub Project](https://github.com/oil-rope/oil-and-rope/) following
the [Installation Guide](https://github.com/oil-rope/oil-and-rope/#installation)
but keep in mind the **if you want to work with the chat you'll need**
**to [Setup Channels](https://github.com/oil-rope/oil-and-rope/#optional-setup-channels)**.

#### Create admin user

**If you created a [docker container](#quickstart)** you'll need to open a
new terminal and run `docker exec -ti oar_core bash` this will create a
bash terminal inside the container so you can execute any command you
want.  
For creating a superuser user just run
`poetry run ./manage.py createsuperuser` and set Username, Email and
Password as requested.

**If you are running the project** just run
`python ./manage.py createsuperuser` (*inside the virtual environment if you created one*) and set Username, Email and Password.

Then you'll be able to access [localhost:8000](http://localhost:8000/).

### Frontend

Once you have cloned the repository
(`git clone https://github.com/oil-rope/oilandrope-tabletop`) access
the folder (`cd oilandrope-tabletop`) and execute `npm i -D`.  
Once the installation is complete just run it by using `npm start`.

Now you should be able to access [localhost:8080](http://localhost:8080).
