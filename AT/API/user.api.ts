import {createApiContext} from '@utils/api-client';
import {API} from '@constants/url';
import {logApi} from '@utils/logger'
export class UserApi {
    

    //CRUD delete By Username
    async deleteByUsername (username: string){
        const api = await createApiContext();
        const response = await api.delete(
        API.admin.deleteUserByUsername(username)
        );
        await logApi(
            "delete By Username",
            "DELETE",
            API.admin.createUser,
            username,
            response
        );
        return response;
    };

    //CRUD get By Username
    async getByUsername (username: string){}

    //CRUD create User
    async register (user: any){
        const api = await createApiContext();
        const response = await api.post(API.admin.createUser, {
          data: user
        });
        await logApi(
            "Create User",
            "POST",
            API.admin.createUser,
            user,
            response
        );
        return response;
        
    }

}