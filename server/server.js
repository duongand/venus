require('dotenv').config();
const path = require('path');
const axios = require('axios');
const express = require('express');
const app = express();
const port = process.env.PORT || 8888;

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const BASE_API_URL = 'https://api.spotify.com';

function generateRandomString(length) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    };
    return text;
};

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('/login', (req, res) => {
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

app.get('/callback', (req, res) => {
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
                'Content-Type': 'application/x-www-form-urlencoded',
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

app.get('/refresh_token', (req, res) => {
    const refreshToken = req.query.refresh_token;
    const data = new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken
    });

    axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + new Buffer.from(CLIENT_ID + ':' + CLIENT_SECRET).toString('base64')
        },
    }).then((response) => {
        if (response.status === 200) {
            const params = new URLSearchParams({
                access_token: response.data.access_token,
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
});

app.get('/get_playlists', (req, res) => {
    const accessToken = req.query.access_token;

    axios.get(`${BASE_API_URL}/v1/me/playlists`, {
        params: {
            limit: 50,
            offset: 0
        },
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        res.send(response.data);
    }).catch((error) => {
        res.send(error);
    });
});

app.get('/get_playlist_tracks', (req, res) => {
    const accessToken = req.query.access_token;
    const playlistIds = req.query.id;

    axios.get(`${BASE_API_URL}/v1/playlists/${playlistIds}/tracks`, {
        params: {
            limit: 50,
            market: 'US'
        },
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        res.send(response.data.items);
    }).catch((error) => {
        res.send(error);
    });
});

app.get('/get_audio_features', (req, res) => {
    const accessToken = req.query.access_token;
    const trackIds = req.query.track_ids;

    axios.get(`${BASE_API_URL}/v1/audio-features`, {
        params: {
            ids: trackIds
        },
        headers: {
            Accept: 'application/json',
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        }
    }).then((response) => {
        res.send(response.data.audio_features);
    }).catch((error) => {
        res.send(error);
    });
});

app.get('/*', (req, res) => {
    res.sendFile('index.html', { root: path.join(__dirname, '..', 'client', 'build') });
});

app.listen(port, () => {
    console.log(`venus is listening on port ${port}`);
});