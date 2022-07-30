import Options from "./dashboard/Options";
import KeyButtons from "./dashboard/KeyButtons";
import Chart from "./dashboard/Chart";

function Dashboard({ playlistNames, selectedPlaylistTracks, chartKey, handlePlaylistChange, handleKeyChange }) {
    return (
        <div className="dashboard">
            <h1 className="dashboard--title">DASHBOARD</h1>
            {playlistNames && <Options playlistNames={playlistNames} handlePlaylistChange={handlePlaylistChange} />}
            <KeyButtons handleKeyChange={handleKeyChange}/>
            {selectedPlaylistTracks && chartKey && <Chart selectedPlaylistTracks={selectedPlaylistTracks} chartKey={chartKey}/>}
        </div>
    );
};

export default Dashboard;