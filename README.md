## venus

`venus` is a fun web application project utilizing React and D3.js to visualize your playlist songs pulled from the Spotify API. This project is an extension of `bird-scout` in incorporating an external API server-side; however, with a more [thorough authorization code flow](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/).

![demo-screenshot](./demo-screenshot.png)
![demo-screenshot-2](<./demo-screenshot%20(2).png>)

### Summary

I spend a majority of my day either listening to or searching for more music that grew my interest. Spotify is an application I cannot go a day without listening to music whether it's in the car, showering, or even cleaning around the house. Spotify provides interesting [quantitative audio features](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-audio-features) such as the danceability, energy, or tempo of a song.

`venus` was an inspiration from my school alumni's [blog post](https://www.kexinzhang.com/2018/12/20/2018-in-music.html) reviewing her music taste in the 2020 year. I thought it was an awesome way to compare your music within a playlist and was greatly intrigued by the Mike Bostock's use of D3.js for the [Beeswarm diagram](https://bl.ocks.org/mbostock/6526445e2b44303eebf21da3b6627320) and [Circle Packing diagram](https://bl.ocks.org/mbostock/ca5b03a33affa4160321). This provided invaluable experience working with React, Spotify's API, and d3-force. Some struggles I encountered were interesting behaviors using d3-force in a React application such as the re-rendering of a component causing the node positions and simulation to not retain its previous value due to re-rendering.

### Installation Instructions
1. In the root of the project, run `npm run install` in the terminal.
2. Navigate to the ![Spotify Developer page](https://developer.spotify.com/) and log into the account dashboard.
3. Create an app named with any name and a quick description. 
4. Go into the newly created app and click on `Edit settings`.
5. Add `http://localhost:8888/callback` as a `Redirect URI` and save. 
6. Clone the `.env_template` file in the `server` folder, rename it to `.env` and replace the environment variables with their appropriate values from the application's dashboard.
7. Change directory to the `server` sub-folder and run `npm run dev-start` in the terminal.
8. Open a browser and navigate to `http://localhost:8888/`.
