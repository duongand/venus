## venus

`venus` is a fun web application project utilizing React and D3.js to visualize your playlist songs pulled from the Spotify API. This project is an extension of `bird-scout` in incorporating an external API server-side; however, with a more [thorough authorization code flow](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/).

[Live Demo](https://react-spotify-venus.herokuapp.com/)

![demo-screenshot](./demo-screenshot.png)
![demo-screenshot-2](<./demo-screenshot%20(2).png>)

### Summary

I spend a majority of my day either listening to or searching for more music to pique my interest. Spotify is an application I cannot go a day without whether it's in the car, showering, or even cleaning. Spotify provides interesting [quantitative features](https://developer.spotify.com/documentation/web-api/reference/#/operations/get-audio-features) such as the danceability, energy, or tempo of a song. `venus` plots and compares those values using a [Beeswarm plot.](https://observablehq.com/@d3/beeswarm)

`venus` was an inspiration from my school alumni's [blog post](https://www.kexinzhang.com/2018/12/20/2018-in-music.html) reviewing her music taste in the 2020 year. I thought it was an awesome way to compare your music within a playlist and was greatly intrigued by the D3.js library. This provided invaluable experience working with React, Spotify's API, and the d3-force. Some struggles I encountered interesting behaviors using d3-force in a React application such as the re-rendering of a component causing the previous node positions and simulation to not retain its previous value due to re-rendering.