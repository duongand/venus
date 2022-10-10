import dotenv from 'dotenv';
import axios from 'axios';
import express from 'express';

dotenv.config();
export const apiRouter = new express.Router();

import {
    generateRandomString,
    getPlaylists,
    getPlaylistTracks,
    getTrackAudioFeatures
} from './requests.js';

import {
    extractPlaylistInfo,
    extractTrackId,
} from './helpers.js';

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

apiRouter.get('/login', (req, res) => {
    const state = generateRandomString(16);
    const scope = 'playlist-read-private';

    res.redirect('https://accounts.spotify.com/authorize?' +
        new URLSearchParams({
            'response_type': 'code',
            'client_id': CLIENT_ID,
            'scope': scope,
            'redirect_uri': REDIRECT_URI,
            'state': state
        }));
});

apiRouter.get('/callback', (req, res) => {
    const code = req.query.code || null;
    const state = req.query.state || null;

    if (code === null || state === null) {
        res.redirect('/');
    } else {
        const data = new URLSearchParams({
            code: code,
            redirect_uri: REDIRECT_URI,
            grant_type: 'authorization_code'
        });

        axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data,
            headers: {
                'Content-Type': 'Application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
            },
        }).then((response) => {
            if (response.status === 200) {
                const params = new URLSearchParams({
                    access_token: response.data.access_token,
                    refresh_token: response.data.refresh_token,
                    expires_in: response.data.expires_in
                }).toString();

                res.redirect(`https://react-spotify-venus.herokuapp.com/?${params}`);
            } else {
                res.redirect(`https://react-spotify-venus.herokuapp.com/?${new URLSearchParams({
                    error: 'invalid_token'
                })}`);
            };
        }).catch((error) => {
            res.send(error);
        });
    };
});

// apiRouter.get('/refresh_token', (req, res) => {
//     const refreshToken = req.query.refresh_token;
//     const data = new URLSearchParams({
//         grant_type: 'refresh_token',
//         refresh_token: refreshToken
//     });

//     axios({
//         method: 'post',
//         url: 'https://accounts.spotify.com/api/token',
//         data,
//         headers: {
//             'Content-Type': 'Application/x-www-form-urlencoded',
//             'Authorization': 'Basic ' + new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
//         },
//     }).then((response) => {
//         if (response.status === 200) {
//             const params = new URLSearchParams({
//                 access_token: response.data.access_token,
//             }).toString();

//             res.redirect(`http://localhost:8888/?${params}`);
//         } else {
//             res.redirect(`http://localhost:8888/?${new URLSearchParams({
//                 error: 'invalid_token'
//             })}`);
//         };
//     }).catch((error) => {
//         res.send(error);
//     });
// });

apiRouter.get('/get_playlists', async (req, res) => {
    const playlists = await getPlaylists(req.query.access_token);
    const playlistInformation = extractPlaylistInfo(playlists);
    res.send(playlistInformation);
});

apiRouter.get('/playlist_features', async (req, res) => {
    const playlistTracks = await getPlaylistTracks(req.query.access_token, req.query.id);
    const joinedTrackIds = extractTrackId(playlistTracks).join(',');
    const trackAudioFeatures = await getTrackAudioFeatures(req.query.access_token, playlistTracks, joinedTrackIds);
    res.send(trackAudioFeatures);
});