/**
* Expose middleware
*/

var utils = exports = module.exports = {

	getUserDatabase:function(usr_d){
		// if req' method is post,  database is from user 
		// or database is from cert
		
		return [usr_d.pfix,
				'_',
				usr_d.nfix	
				].join('');
	}	
};

