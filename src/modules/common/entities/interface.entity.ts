class DishInfo {
  _id: string
  name: string
  count: number
}

interface UserInfo {
  _id: string
  fullName: string
  username: string
}

interface PermissionInfo {
  _id: string
  code: string
}

export {
  DishInfo,
  UserInfo,
  PermissionInfo
}
