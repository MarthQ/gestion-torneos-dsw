import { User } from '../../user/user.entity'

export class UserMapper {
    static getUserResponse(user: User) {
        return {
            id: user.id,
            name: user.name,
            mail: user.mail,
            location: user.location,
            role: user.role,
        }
    }
}
