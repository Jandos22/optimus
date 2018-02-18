export interface UserEntity {
  [id: number]: {
    Id: number;
    Name: string;
    Surname: string;
    Alias: string;
    Email: string;
    Gin: string;
    Location: string;
    Photo: {
      Url: string;
      Description: string;
    };
    __metadata: any;
  };
}
