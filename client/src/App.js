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
                    'id': playlist.id,
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
        axios.get('/get_playlist_tracks', {
            params: {
                id: selectedPlaylist.id
            }
        }).then((response) => {
            console.log(response);
        }).catch((error) => {
            console.log(error);
        });
    }, [selectedPlaylist]);

	return (
		<div className="App">
			{accessToken ? 
				<Dashboard 
					playlistItems={playlistItems}
					selectedPlaylist={selectedPlaylist}
					selectedPlaylistTracks={selectedPlaylistTracks}
				/> : 
				<Login />
			}
		</div>
	);
}

export default App;
