import React, { Component } from "react";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, FormControlLabel, Radio, RadioGroup} from "@material-ui/core";
import { Link } from "react-router-dom";


export default class CreateRoomPage extends Component {
    static defaultProps = {
        votesToSkip: 2,
        guestCanPause: true,
        update: false,
        roomCode: null,
        updateCallback: () => {},
    }

    constructor(props) {
        super(props);
        this.state = {
            guestCanPause: this.props.guestCanPause,
            votesToSkip: this.props.votesToSkip,
        };

        this.handleRoomButtonClicked = this.handleRoomButtonClicked.bind(this);
        this.handleVotesChange = this.handleVotesChange.bind(this);
        this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
        this.handleUpdateButtonClicked = this.handleUpdateButtonClicked.bind(this);
    }

    handleVotesChange(e) {
        this.setState({
            votesToSkip: e.target.value,
        })
    }

    handleGuestCanPauseChange(e) {
        this.setState({
            guestCanPause: e.target.value === "true" ? true: false,
        })
    }

    handleRoomButtonClicked() {
        const requestOptions = {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause
            })
        };

        fetch('/api/create-room', requestOptions)
        .then(response => response.json())
        .then(data => this.props.history.push('/room/' + data.code))
    }

    handleUpdateButtonClicked() {
        const requestOptions = {
            method: 'PATCH',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                votes_to_skip: this.state.votesToSkip,
                guest_can_pause: this.state.guestCanPause,
                code: this.props.roomCode,
            })
        };

        fetch('/api/update-room', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.Message) {
                alert(data.Message);
            } else {
                alert('Room updated successfully!')
            }
            this.props.updateCallback();
        })
    }

    renderCreateButtons() {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color="secondary" variant="contained" onClick={this.handleRoomButtonClicked}>Create Room</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color="primary" variant="contained" to="/" component={Link}>Back</Button>
                </Grid>
            </Grid>
        )
    }

    renderUpdateButtons() {
        return (
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" onClick={this.handleUpdateButtonClicked}>Update Room</Button>
            </Grid>
        )
    }

    render() {
        const title = this.props.update ? "Update Room" : "Create Room";
        return <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component="h4" variant="h4">
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">Guest Control of Playback State</div>
                    </FormHelperText>
                    <RadioGroup row defaultValue={this.props.guestCanPause.toString()} onChange={this.handleGuestCanPauseChange}>
                        <FormControlLabel 
                            value="true" 
                            control={<Radio color="primary"></Radio>} 
                            label="Play/Pause" 
                            labelPlacement="bottom">
                        </FormControlLabel>
                        <FormControlLabel 
                            value="false" 
                            control={<Radio color="secondary"></Radio>} 
                            label="No Control" 
                            labelPlacement="bottom">
                        </FormControlLabel>
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <TextField 
                        required={true} 
                        type="number"
                        onChange={this.handleVotesChange}
                        defaultValue={this.state.votesToSkip}
                        inputProps={{
                            min: 1,
                            style: { textAlign: "center"},
                        }}>
                    </TextField>
                    <FormHelperText>
                        <div align="center">Votes Required to Skip Song</div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {this.props.update ? this.renderUpdateButtons() : this.renderCreateButtons()}
        </Grid>;
    }
}