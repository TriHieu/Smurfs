const {firebase,firebaseClient} = require('./firebaseConfig')

class Auth {
    constructor(){
        this.firebaseClient = firebaseClient;
        this.firebaseAdmin = firebase;
        this.database=this.firebaseClient.database();
    }

}

module.exports=Auth;