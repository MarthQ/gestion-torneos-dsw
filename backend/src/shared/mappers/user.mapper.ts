import { User } from '../../user/user.entity'

export class UserMapper {
    static getUserResponse(user: User) {
        return {
            id: user.id,
            name: user.name,
            mail: user.mail,
            avatarId: user.avatarId,
            nameChangedOn: user.nameChangedOn,
            location: user.location,
            role: user.role,
        }
    }
}
