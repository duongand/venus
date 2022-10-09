import Options from "./dashboard/Options";
import KeyButtons from "./dashboard/KeyButtons";
import Chart from "./dashboard/Chart";

function Dashboard({ playlists, playlistTracks, chartKey, handlePlaylistChange, handleKeyChange }) {
    return (
        <div className="dashboard">
            <h1 className="dashboard--title">DASHBOARD</h1>
            {playlists && <Options playlists={playlists} handlePlaylistChange={handlePlaylistChange} />}
            <KeyButtons handleKeyChange={handleKeyChange}/>
            {playlistTracks && chartKey && <Chart playlistTracks={playlistTracks} chartKey={chartKey}/>}
        </div>
    );
};

export default Dashboard;