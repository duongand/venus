import { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import { checkLocalStorage, getAccessToken, setLocalStorage } from './authFunctions';

const axios = require('axios');

function App() {
	const [accessToken, setAccessToken] = useState(null);
	const [refreshToken, setRefreshToken] = useState(null);

	const [playlistItems, setPlaylistItems] = useState([]);
	const [playlistIds, setPlaylistIds] = useState({});
	const [selectedPlaylist, setSelectedPlaylist] = useState('');
	const [selectedPlaylistTracks, setSelectedPlaylistTracks] = useState([]);
	const [playlistTrackIds, setPlaylistTrackIds] = useState('');
	const [trackInformation, setTrackInformation] = useState({});
	const [trackAudioFeatures, setTrackAudioFeatures] = useState({});
	const [compiledInformation, setCompiledInformation] = useState([]);

	function handleChange(event) {
		setSelectedPlaylist(event.target.value);
	};

	useEffect(() => {
		if (checkLocalStorage()) {
			const { storedAccessToken, storedRefreshToken } = getAccessToken();

			setAccessToken(storedAccessToken);
			setRefreshToken(storedRefreshToken);
			window.history.pushState({}, null, '/');
		} else {
			setLocalStorage();
		};
	}, [])

	useEffect(() => {
		if (accessToken === null) return;

		axios.get('/get_playlists', {
			params: {
				access_token: accessToken
			}
		}).then((response) => {
			const playlistNames = response.data.items.map((playlist) => {
				return playlist.name;
			});

			const playlistIdsTemp = {};
			for (const playlist of response.data.items) {
				playlistIdsTemp[playlist.name] = {
					'id': playlist.id
				};
			};

			setPlaylistItems(playlistNames);
			setPlaylistIds(playlistIdsTemp)
			setSelectedPlaylist(playlistNames[0]);
		}).catch((error) => {
			console.log(error);
		});
	}, [accessToken]);

	useEffect(() => {
		if (selectedPlaylist === '') return;

		axios.get('/get_playlist_tracks', {
			params: {
				access_token: accessToken,
				id: playlistIds[selectedPlaylist].id
			}
		}).then((response) => {
			const trackIds = response.data.map((data) => {
				return data.track.id;
			});

			const joinedTrackIds = trackIds.join(',');
			setPlaylistTrackIds(joinedTrackIds);

			const preTrackInformation = {}; 
			response.data.map((data) => {
				preTrackInformation[data.track.id] = {
					'name': data.track.name,
					'artist': data.track.artists[0].name,
					'album': data.track.album.name
				};
			});

			setTrackInformation(preTrackInformation);
		}).catch((error) => {
			console.log(error);
		});
	}, [selectedPlaylist]);

	useEffect(() => {
		if (playlistTrackIds === '') return;

		axios.get('/get_audio_features', {
			params: {
				access_token: accessToken,
				track_ids: playlistTrackIds
			}
		}).then((response) => {
			const data = response.data;

			const tempCompiledInformation = [];
			for (const track of data) {
				const tempTrackId = track.id;

				const tempTrack = {
					'acousticness': track.acousticness,
					'danceability': track.danceability,
					'energy': track.energy,
					'instrumentalness': track.instrumentalness,
					'liveness': track.liveness,
					'loudness': track.loudness,
					'speechiness': track.speechiness,
					'tempo': track.tempo,
					'valence': track.valence,
					'name': trackInformation[tempTrackId].name,
					'artist': trackInformation[tempTrackId].artist,
					'album': trackInformation[tempTrackId].album
				};

				tempCompiledInformation.push(tempTrack);
			};

			setCompiledInformation(tempCompiledInformation);
		}).catch((error) => {
			console.log(error);
		});
	}, [playlistTrackIds])

	return (
		<div className="App">
			{accessToken ?
				<Dashboard
					playlistItems={playlistItems}
					selectedPlaylist={selectedPlaylist}
					selectedPlaylistTracks={selectedPlaylistTracks}
					handleChange={handleChange}
				/> :
				<Login />
			}
		</div>
	);
}

export default App;
