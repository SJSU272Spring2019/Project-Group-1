import React, { Component } from 'react'
import CardComponent from './CardComponent';
import API from '../lib/interceptor';
let api = new API();
export default class Search extends Component {
    state = {
        cards: [],
        error: "",
        user: {}
    }
    searchNow = (e) => {
        if (!!e) {
            e.preventDefault();
        }

        let value = ((e || {}).target || {}).value || "";
        console.log(value)
        if(!value){
            this.setState({
                cards: [],
                error: ""
            });
        }else{
            api.call({
                url: '/user/123',
                method: "GET",
            }).then((dbObj) => {
                let userObj = dbObj.user || {};
                api.call({
                    url: '/search',
                    method: "GET",
                    query: {
                        q: value || ""
                    }
                }).then((data) => {
                    this.setState({
                        cards: !!this.userExists() ? data.cards : [],
                        user: !!this.userExists() ? userObj : {},
                        error: !this.userExists() ? "Login First" : ""
                    });
                }).catch((err) => {
                    this.setState({
                        cards: [],
                        error: !this.userExists() ? "Login First" : (err.message || "Error Fetching Data")
                    });
                });
            }).catch(err => {
                this.setState({
                    cards: [],
                    error: !this.userExists() ? "Login First" : (err.message || "Error Fetching Data")
                });
            })
        }
       



    };
    bookmarkUpload = (uploadId) => {
        console.log("UPLAOD ID ",uploadId)
        return (e) => {
            e.preventDefault();
            console.log("BOOKMARKING "+uploadId)
            api.call({
                method: "POST",
                url: "/user/123/bookmark/" + uploadId
            }).then(() => {
                this.getBookmarks();
            }).catch((err) => {
                this.setState({
                    cards: [],
                    error: err.message || "Error Fetching Data"
                });
            })
        }
    }
    componentDidMount = () => {
        this.props.changeActiveTab("Search");
        this.searchNow();
    }
    userExists = ()=>
    {
        return !!localStorage.getItem("token") ? true : false;
    }
    render() {

        return (
            <div>
                {!!this.state.error && <div class="alert alert-warning" role="alert">
                    Sorry! {this.state.error}
                </div>}

                <div className="input-group">
                    <input type="text" className="form-control" aria-label="Text input with segmented dropdown button" onChange={this.searchNow}/>
                    <div className="input-group-append">
                        <button type="button" className="btn btn-outline-secondary"><i className="fas fa-search"></i>&nbsp;Search</button>
                    </div>
                </div>
                <br />
                <div><h5>Search Results</h5></div>
                <br />
                <div class="card-deck">
                    {!!this.state.cards && !!this.state.cards.length && this.state.cards.map((x, i) => {
                        return <CardComponent cardData={x} user={this.state.user} bookmarkUpload={this.bookmarkUpload}/>
                    })
                    }
                </div>
                {!!this.state.cards && !this.state.cards.length && <h6><i>Empty Search Result</i></h6>}


            </div>
        )
    }
}
