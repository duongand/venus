import Options from "./dashboard/Options";

function Dashboard({ playlistItems, selectedPlaylist, selectedPlaylistTracks, handleChange }) {
    return (
        <div className="dashboard" onChange={handleChange}>
            <h1 className="dashboard--title">DASHBOARD</h1>
            {playlistItems && <Options playlistItems={playlistItems} handleChange={handleChange} />}
        </div>
    );
};

export default Dashboard;