import * as bcrypt from'bcrypt';
// import * as speakeasy from 'speakeasy';

export const utils = {
	hashPassword : password => {
		return new Promise((resolve,reject) => {
			bcrypt.genSalt(parseInt(process.env.saltRounds), function(err, salt) {
			    bcrypt.hash(password, salt, function(err, hash) {
			    	resolve(hash);
			    });
			});
		});
  	},
    // verifyTwoFactorAuthenticationCode : (twoFactorAuthenticationCode: string, user: any) => {
    //     return speakeasy.totp.verify({
    //         secret: user.twoFactorAuthenticationCode,
    //         encoding: 'base32',
    //         token: twoFactorAuthenticationCode,
    //     });
    // }

}