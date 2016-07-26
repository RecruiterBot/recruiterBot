const Students = require( '../schemas/Students' );

module.exports =  config  => {


	const unwrapFromList = cb => {
		return ( err, data ) => {
			if ( err ) {
				return cb( err );
			}
			cb( null, data );
		}
	}

	const storage = {

		students:{
			get( id, cb ) {
				Students.findOne( { id: id } ), unwrapFromList( cb );
			},
			save ( data, cb ) {
				Students.findByIdAndUpdate( { id: data.id }, data, { upsert: true, new: true }, cb );
			},
			all( cb ) {
				Students.find( {}, cb )
			}
		},
		teams: {
            get ( id, cb ) {
                Teams.findOne( { id: id }, unwrapFromList( cb ) );
            },
            save ( data, cb ) {
                Teams.findAndModify( {
                    id: data.id
                }, data, {
                    upsert: true,
                    new: true
                }, cb );
            },
            all ( cb ) {
                Teams.find( {}, cb );
            }
        },
        users: {
            get ( id, cb ) {
                Users.findOne( { id: id }, unwrapFromList( cb ) );
            },
            save ( data, cb ) {
                Users.findAndModify( {
                    id: data.id
                }, data, {
                    upsert: true,
                    new: true
                }, cb );
            },
            all ( cb ) {
                Users.find( {}, cb );
            }
        },
        channels: {
            get ( id, cb ) {
                Channels.findOne( { id: id }, unwrapFromList( cb ) );
            },
            save ( data, cb ) {
                Channels.findAndModify( {
                    id: data.id
                }, data, {
                    upsert: true,
                    new: true
                }, cb );
            },
            all ( cb ) {
                Channels.find( {}, cb );
            }
        }

	}
	return storage;

}
