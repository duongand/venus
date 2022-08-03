function extractPlaylistName(response) {
    return response.data.items.map((playlist) => {
        return playlist.name;
    });
};

function extractPlaylistId(response) {
    const playlistIds = {};
    for (const playlist of response.data.items) {
        playlistIds[playlist.name] = {
            'id': playlist.id
        };
    };

    return playlistIds;
};

function extractTrackId(response) {
    return response.data.map((data) => {
        return data.track.id;
    });
};

function compilePreTrackInformation(response) {
    const preTrackInformation = {};
    for (const data of response.data) {
        preTrackInformation[data.track.id] = {
            'name': data.track.name,
            'artist': data.track.artists[0].name,
            'album': data.track.album.name,
            'popularity': data.track.popularity
        };
    };

    return preTrackInformation;
};

function compileFinalTrackInformation(response, preTrackInformation) {
    const compiledInformation = [];
    for (const track of response.data) {
        const trackId = track.id;

        const compiledTrack = {
            'acousticness': track.acousticness,
            'danceability': track.danceability,
            'energy': track.energy,
            'instrumentalness': track.instrumentalness,
            'liveness': track.liveness,
            'loudness': track.loudness,
            'speechiness': track.speechiness,
            'tempo': track.tempo,
            'valence': track.valence,
            'name': preTrackInformation[trackId].name,
            'artist': preTrackInformation[trackId].artist,
            'album': preTrackInformation[trackId].album,
            'popularity': preTrackInformation[trackId].popularity
        };

        compiledInformation.push(compiledTrack);
    };

    return compiledInformation;
};

export { extractPlaylistName, extractPlaylistId, extractTrackId, compilePreTrackInformation, compileFinalTrackInformation };