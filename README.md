# LeagueStats

[![Netlify Status](https://api.netlify.com/api/v1/badges/caa8be10-e095-4934-81ef-b662fb73483f/deploy-status)](https://app.netlify.com/sites/leaguestats-gg/deploys)
<a href="https://discord.gg/RjBzjfk"><img src="https://img.shields.io/badge/Discord-join%20chat-738bd7.svg" alt="LeagueStats.gg official Discord"></a>

The goal of [leaguestats.gg](https://leaguestats.gg) is to provide global complete data for all League of Legends summoners.  
Here is an [example](https://leaguestats.gg/summoner/euw/KCRekkles) of stats for some summoner.

![Screenshot](https://res.cloudinary.com/kln/image/upload/v1615669773/repository-preview-leaguestats.jpg)

[![DigitalOcean Hosting](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%201.svg)](https://www.digitalocean.com/?refcode=4f4a6c382133&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)

## Installation

Development environment requirements :

- [Node.js](https://nodejs.org/en/download/) >= 12.0.0
- [PostgreSQL](https://www.postgresql.org/download/)
- [Redis](https://redis.io/download)

You can use the `docker-compose.yml` file to quickly setup Postgre and Redis in development.

Setting up the docker container:

```bash
> docker-compose up --build -d
```

Setting up your development environment on your local machine :

```bash
> git clone https://github.com/vkaelin/LeagueStats.git
> cd leaguestats/client
> npm install

# And

> cd leaguestats/server
> npm install
> cp .env.example .env # edit the values
> node ace migration:run
```

### Env Values

Before running the migrations, you need to add some details to the server .env:

1. To generate the APP_KEY run ```node ace generate:key```, copy and paste the value on the respective .env variable;

2. Set the database variables PG_USER, PG_PASSWORD and PG_DB_NAME. If you are using docker,
you can set as below:

```
PG_USER=root
PG_PASSWORD=root
PG_DB_NAME=leaguestats
```

3. For the application work properly, you need a Riot API Key to set it on RIOT_API_KEY .env variable. To know more, take a look to their documentation on [this link](https://developer.riotgames.com/).


## Useful commands

Running the app :

```bash
> cd client
> npm run dev

# And

> cd server
> npm run dev
```

Deploying the app :

```bash
> cd client
> npm run build

# And

> cd server
> npm run build
> node build/server.js
```

## Contributing

Do not hesitate to contribute to the project by adapting or adding features ! Bug reports or pull requests are welcome.

## License

NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)  
https://creativecommons.org/licenses/by-nc-sa/4.0/

### You are free to:

Share — copy and redistribute the material in any medium or format

Adapt — remix, transform, and build upon the material

### Under the following terms:

NonCommercial — You may not use the material for commercial purposes.

ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
