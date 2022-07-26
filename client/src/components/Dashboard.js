import Options from "./dashboard/Options";

function Dashboard({ playlistItems, selectedPlaylist, selectedPlaylistTracks }) {
    return (
        <div className="dashboard">
            <h1 className="dashboard--title">DASHBOARD</h1>
            <p>Selected playlist: {selectedPlaylist}</p>
            {playlistItems && <Options playlistItems={playlistItems} />}
        </div>
    );
};

export default Dashboard;