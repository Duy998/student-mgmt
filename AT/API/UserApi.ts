import {createApiContext} from './ApiClient';
import {API} from '../constants/url';


export class UserApi {

    //CRUD delete By Username
    async deleteByUsername (username: string){
        const api = await createApiContext();
        const response = await api.delete(
        API.admin.deleteUserByUsername(username)
        );
        console.log(await response.text());
        console.log(response.status());
        console.log(response.url());
        return response;
    };

    //CRUD get By Username



    




}