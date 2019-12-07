# LeagueStats

[![Netlify Status](https://api.netlify.com/api/v1/badges/caa8be10-e095-4934-81ef-b662fb73483f/deploy-status)](https://app.netlify.com/sites/leaguestats-gg/deploys)


The goal of [leaguestats.gg](https://leaguestats.gg) is to provide global complete data for all League of Legends summoners.

![Screenshot](https://res.cloudinary.com/kln/image/upload/v1575754595/leaguestats-preview.png)

## Installation

Development environment requirements :
- [MongoDB](https://www.mongodb.com/download-center/community)
- [Redis](https://redis.io/download)

Setting up your development environment on your local machine :
```bash
> git clone https://github.com/vkaelin/LeagueStats.git
> cd leaguestats/client
> npm install

# And

> cd leaguestats/server
> npm install
> cp .env.example .env
> adonis migration:run
```

## Useful commands
Running the app :
```bash
> cd client
> npm run serve

# And

> cd server
> adonis serve --dev
```

Building the app :
```bash
> cd client
> npm run build
```

## Contributing

Do not hesitate to contribute to the project by adapting or adding features ! Bug reports or pull requests are welcome.

## License

NonCommercial-ShareAlike 1.0 Generic (CC NC-SA 1.0)  
https://creativecommons.org/licenses/nc-sa/1.0/

### You are free to:

Share — copy and redistribute the material in any medium or format  

Adapt — remix, transform, and build upon the material

### Under the following terms:


NonCommercial — You may not use the material for commercial purposes.

ShareAlike — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.
