# LeagueStats

[![Netlify Status](https://api.netlify.com/api/v1/badges/caa8be10-e095-4934-81ef-b662fb73483f/deploy-status)](https://app.netlify.com/sites/leaguestats-gg/deploys)
<a href="https://discord.gg/RjBzjfk"><img src="https://img.shields.io/badge/Discord-join%20chat-738bd7.svg" alt="LeagueStats.gg official Discord"></a>


The goal of [leaguestats.gg](https://leaguestats.gg) is to provide global complete data for all League of Legends summoners.  
Here is an [example](https://leaguestats.gg/summoner/euw/Alderiate) of stats for some summoner.

![Screenshot](https://res.cloudinary.com/kln/image/upload/v1580935119/leaguestats-preview.png)

<p>
  <a href="https://www.digitalocean.com/">
    <img src="https://opensource.nyc3.cdn.digitaloceanspaces.com/attribution/assets/PoweredByDO/DO_Powered_by_Badge_blue.svg" width="201px">
  </a>
</p>

## Installation

Development environment requirements :
- [Node.js](https://nodejs.org/en/download/) >= 12.0.0
- [MongoDB](https://www.mongodb.com/download-center/community) >= 4.4
- [Redis](https://redis.io/download)

Setting up your development environment on your local machine :
```bash
> git clone https://github.com/vkaelin/LeagueStats.git
> cd leaguestats/client
> npm install

# And

> cd leaguestats/server
> npm install
> cp .env.example .env # edit the values
> node ace mongodb:migration:run # your MongoDB installation needs to by a Replica Set and not a Standalone
```

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
