// requires //

const express = require ( 'express' );
const mongoose = require( 'mongoose' );
const { json } = require( 'body-parser' );
const { urlencoded } = require ( 'body-parser' );
const MR = require( './server/masterRoutes' );
const Sophie = require( './server/ctrls/sophieCtrl' );
const Botkit = require( 'botkit' )
const ApiaiBotkit = require( 'api-ai-botkit' )

// setup app //

const app = express();

// ports and URI //

const port = process.env.PORT || 8888;
const mongoURI = 'mongodb://Student:devmountain@ds031965.mlab.com:31965/recruiterbotdb';

// app pre-processors //

app.use( urlencoded( { extended: true } ) ); //
app.use( json() );
app.use( express.static( `${ __dirname }/public`) );// public contains static assets and these are getting served up to express middleware

// use Master Routes //

MR( app );
Sophie( ApiaiBotkit, Botkit, app, mongoURI );

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
