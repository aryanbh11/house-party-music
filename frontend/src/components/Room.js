import React, { Component } from "react";
import { Button, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import CreateRoomPage from "./CreateRoomPage"; 
import MediaPlayer from "./MediaPlayer"


export default class Room extends Component {
    constructor(props) {
        super(props)
        this.state = {
            votesToSkip: 2,
            guestCanPause: false,
            isHost: false,
            showSettings: false,
            spotifyAuthenticated: false,
            song: {}
        };
        // We can get the room code from the url as it will be present as a parameter in the route 
        // (Refer to HomePage.js)
        this.roomCode = this.props.match.params.roomCode;
        this.leaveButtonClicked = this.leaveButtonClicked.bind(this);
        this.updateShowSettings = this.updateShowSettings.bind(this);
        this.renderSettingsButton = this.renderSettingsButton.bind(this);
        this.getRoomDetails = this.getRoomDetails.bind(this);
        this.authenticate_spotify = this.authenticate_spotify.bind(this);
        this.getCurrentSong = this.getCurrentSong.bind(this);
        this.getRoomDetails();
    }

    componentDidMount() {
        this.interval = setInterval(this.getCurrentSong, 1000)
    }

    componentWillUnmount() {
        clearInterval(this.interval)
    }

    getRoomDetails() {
        fetch('/api/get-room?code=' + this.roomCode)
        .then(response => {
            if (!response.ok) {
                this.props.leaveRoomCallback();
                this.props.history.push('/');
            }
            return response.json()})
        .then(data => {
            this.setState({
                votesToSkip: data.votes_to_skip,
                guestCanPause: data.guest_can_pause,
                isHost: data.is_host,
            });
            if (this.state.isHost) {
                this.authenticate_spotify();
            }
        })
    }

    getCurrentSong() {
        fetch('/spotify/current-song')
        .then(response => {
            if (!response.ok) {
                return {}
            } else {
                return response.json();
            }
        })
        .then(data => {
            this.setState({song: data});
            console.log(data)
        });
    }

    authenticate_spotify() {
        fetch('/spotify/is-authenticated')
        .then(response => response.json())
        .then(data => {
            this.setState({
                spotifyAuthenticated: data.status
            });
            if(!data.status) {
                fetch('/spotify/get-auth-url')
                .then(response => response.json())
                .then(data => {
                    // Redirecting to spotify page
                    window.location.replace(data.url);
                });
            }
        });
    }

    leaveButtonClicked() {
        const requestOptions = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
        };
        fetch('/api/leave-room', requestOptions)
        .then(response => {
            this.props.leaveRoomCallback();
            this.props.history.push('/');
        })
    }

    updateShowSettings(value) {
        this.setState({
            showSettings: value,
        })
    }

    renderSettingsButton() {
        return (
            <Grid item xs={12}>
                <Button variant="contained" color="secondary" onClick={() => this.updateShowSettings(true)}>Settings</Button>
            </Grid>
        );
    }

    renderSettings() {
         return (<Grid container spacing={1} align='center'>
            <Grid item xs={12}>
                <CreateRoomPage update={true} 
                    votesToSkip={this.state.votesToSkip} 
                    guestCanPause={this.state.guestCanPause} 
                    roomCode={this.roomCode} 
                    updateCallback={this.getRoomDetails}
                />
            </Grid>
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={() => this.updateShowSettings(false)}>Close</Button>
            </Grid>
        </Grid>);
    }

    render() {
        if (this.state.showSettings) {
            return this.renderSettings();
        }
        return <Grid container spacing={1} align='center'>
            <Grid item xs={12}>
                <Typography variant='h4' component='h4'>
                    Code: {this.roomCode}
                </Typography>
            </Grid>
            <MediaPlayer {...this.state.song} />
            {this.state.isHost ? this.renderSettingsButton(): null}
            <Grid item xs={12}>
                <Button variant="contained" color="primary" onClick={this.leaveButtonClicked}>Leave Room</Button>
              </Grid>
        </Grid>
    }
}