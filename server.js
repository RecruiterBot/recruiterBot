// requires //

const express = require ( 'express' );
const mongoose = require( 'mongoose' );
const session = require('express-session');
const json = require( 'body-parser' ).json;
const urlencoded = require ( 'body-parser' ).urlencoded;
const MR = require( './server/masterRoutes' );
const Sophie = require( './server/ctrls/sophieCtrl' );
const Botkit = require( 'botkit' );
const passport = require( 'passport' );

//  config //

const passportConfig = require( './server/sophiebot/passportConfig' );
const sessionConfig = require ( './server/sophiebot/sessionConfig' );
passportConfig( passport );

// setup app //

const app = express();

// ports and URI //

const port = process.env.PORT || 8888;
const mongoURI = 'mongodb://Student:devmountain@ds031965.mlab.com:31965/recruiterbotdb';

// app pre-processors //

app.use( urlencoded( { extended: true } ) );
app.use( json() );
app.use( express.static( __dirname + '/public') );
app.use( session( sessionConfig ) );
app.use( passport.initialize() );
app.use( passport.session() );

// use Master Routes //

MR( app, passport );
Sophie( Botkit, app, mongoURI );

// mongoose connection //

mongoose.set( `debug`, true );
mongoose.connect( mongoURI ); // currently only sending to local storage
mongoose.connection.once( `open`, () => {
	console.log( `connected to Mongo DB at ${ mongoURI }` );
} );

// express conneciton //

app.listen( port, function(){
  console.log( `Express listening to port ${ port }` );
} )
