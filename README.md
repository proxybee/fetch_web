# Fetch Web

A simple command line application for web scraping/fetching

## Table of Contents

- [Requirement](#requirement)
- [Dependencies](#dependencies)
- [To Run Application](#to-run-application)

  - [On Local](#on-local)
  - [On docker](#on-docker)

- [Feature](#feature)

## Requirement

- Ensure at least nodejs 18 is installed
- If you intend running on docker ensure you have docker engine installed [access/explore this link to select the docker engine and version compatible with your platform](https://docs.docker.com/engine/)

## Dependencies

- typecript
- mocha
- sinon
- chai
- Docker if running on docker

## To run application

## On Local

Install dependencies and then start in the development mode.

```bash
npm install
npm run build
npm run start --metadata https://www.example.com
```

Navigate to the port that was displayed on the terminal. The app should be running after the development build is finished.

## On Docker

To build the docker image:

```bash
npm docker build -t fetch_web .
docker run -ti --rm fetch_web ./fetch.sh --metadata https://www.example.com
```

## To run test

```bash
npm install
npm run test
```

## Feature

-Fetch web page: run the application with required argument as in above to fetch a web page

## Improvement

- Implement better typing with interface
- Use class/static methods instead of functions
- Create a local mirror with all the assets as well as html so that the saved page when opened in the browser would load properly
- I will carry out a more thorough review of the whole flow
