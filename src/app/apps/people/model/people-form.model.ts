export interface PeopleForm {
    name: string;
    surname: string;
    alias: string;
    email: string;
    gin: number;
    location: string;
    photoUrl: {
        Url: string;
        Description: string;
    };
    photo: {
        arraybuffer: ArrayBuffer;
        photoname: string;
    };
}
