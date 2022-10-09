export function extractPlaylistName(response) {
  return response.data.items.map((playlist) => {
      return playlist.name;
  });
}

export function extractPlaylistId(response) {
  const playlistIds = {};
  for (const playlist of response.data.items) {
      playlistIds[playlist.name] = {
          'id': playlist.id
      };
  };

  return playlistIds;
}

export function extractPlaylistInfo(response) {
  return response.items.map((playlist) => ({
    name: playlist.name,
    id: playlist.id,
  }));
}

export function extractTrackId(response) {
  return response.map((data) => {
      return data.track.id;
  });
}

export function compilePreTrackInformation(response) {
  const preTrackInformation = {};
  for (const data of response) {
      preTrackInformation[data.track.id] = {
          'name': data.track.name,
          'artist': data.track.artists[0].name,
          'album': data.track.album.name,
          'popularity': data.track.popularity
      };
  };

  return preTrackInformation;
}

export function compileFinalTrackInformation(trackInformation, trackAudioFeatures) {
  const compiledInformation = trackAudioFeatures.audio_features.map((track) => {
    const trackId = track.id;
      return {
          'acousticness': track.acousticness,
          'danceability': track.danceability,
          'energy': track.energy,
          'instrumentalness': track.instrumentalness,
          'liveness': track.liveness,
          'loudness': track.loudness,
          'speechiness': track.speechiness,
          'tempo': track.tempo,
          'valence': track.valence,
          'name': trackInformation[trackId].name,
          'artist': trackInformation[trackId].artist,
          'album': trackInformation[trackId].album,
          'popularity': trackInformation[trackId].popularity
      };
  });

  return compiledInformation;
}