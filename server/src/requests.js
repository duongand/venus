import axios from 'axios';

const BASE_API_URL = 'https://api.spotify.com';

import {
  compilePreTrackInformation,
  compileFinalTrackInformation
} from './helpers.js';

export function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  };

  return text;
}

export function getPlaylists(accessToken) {
  return axios.get(`${BASE_API_URL}/v1/me/playlists`, {
    params: {
      limit: 50,
      offset: 0
    },
    headers: {
      'Accept': 'Application/x-www-form-urlencoded',
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
  }).then((response) => {
    return response.data;
  }).catch((error) => {
    console.log(error);
  });
}

export function getPlaylistTracks(accessToken, playlistId) {
  if (playlistId === undefined) return;

  return axios.get(`${BASE_API_URL}/v1/playlists/${playlistId}/tracks`, {
    params: {
      limit: 50,
      market: 'US'
    },
    headers: {
      'Accept': 'Application/x-www-form-urlencoded',
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
  }).then((response) => {
    return response.data.items;
  }).catch((error) => {
    console.log(error);
  });
}

export function getTrackAudioFeatures(accessToken, trackInformation, trackIds) {
  return axios.get(`${BASE_API_URL}/v1/audio-features`, {
    params: {
      ids: trackIds
    },
    headers: {
      'Accept': 'Application/x-www-form-urlencoded',
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }
  }).then((response) => {
    const preTrack = compilePreTrackInformation(trackInformation);
    return compileFinalTrackInformation(preTrack, response.data);
  }).catch((error) => {
    console.log(error);
  });
}