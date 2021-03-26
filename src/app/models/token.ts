export class Token{

    constructor(public access_token: string, public expires_in: string,
        public refresh_expires_in: string, public refresh_token: string,
        public token_type:string, public not_before_policy:string,
        public session_state:string, public scope:string){
    }

}