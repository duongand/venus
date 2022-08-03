import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

import {
	extractPlaylistName,
	extractPlaylistId,
	extractTrackId,
	compilePreTrackInformation,
	compileFinalTrackInformation
} from './responseCompileFunctions.js';

function App() {
	const [accessToken, setAccessToken] = useState(null);
	const [refreshToken, setRefreshToken] = useState(null);

	const [playlistNames, setPlaylistNames] = useState([]);
	const [playlistIds, setPlaylistIds] = useState({});
	const [selectedPlaylist, setSelectedPlaylist] = useState('');
	const [playlistTrackIds, setPlaylistTrackIds] = useState('');
	const [trackInformation, setTrackInformation] = useState({});
	const [compiledInformation, setCompiledInformation] = useState(null);

	const [chartKey, setChartKey] = useState('artist');

	function handlePlaylistChange(event) {
		setSelectedPlaylist(event.target.value);
		setPlaylistTrackIds('');
		setCompiledInformation(null);
		setChartKey('artist');
	};

	function handleKeyChange(event) {
		setChartKey(event.target.value);
	};

	useEffect(() => {
		if (window.location.search) {
			const urlParams = new URLSearchParams(window.location.search);
			setAccessToken(urlParams.get('access_token'));
			setRefreshToken(urlParams.get('refresh_token'));
			window.history.pushState({}, null, '/');
		};
	}, [])

	useEffect(() => {
		if (accessToken === null) return;

		axios.get('/get_playlists', {
			params: {
				access_token: accessToken
			}
		}).then((response) => {
			const compiledPlaylistNames = extractPlaylistName(response);

			setPlaylistNames(compiledPlaylistNames);
			setPlaylistIds(extractPlaylistId(response))
			setSelectedPlaylist(compiledPlaylistNames[0]);
		}).catch((error) => {
			console.send(error);
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
			setPlaylistTrackIds(extractTrackId(response).join(','));
			setTrackInformation(compilePreTrackInformation(response));
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
			setCompiledInformation(compileFinalTrackInformation(response, trackInformation));
		}).catch((error) => {
			console.log(error);
		});
	}, [playlistTrackIds])

	return (
		<div className="App">
			{accessToken ?
				<Dashboard
					playlistNames={playlistNames}
					selectedPlaylist={selectedPlaylist}
					selectedPlaylistTracks={compiledInformation}
					chartKey={chartKey}
					handlePlaylistChange={handlePlaylistChange}
					handleKeyChange={handleKeyChange}
				/> :
				<Login />
			}
		</div>
	);
}

export default App;
