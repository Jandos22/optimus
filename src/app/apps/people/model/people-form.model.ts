export interface PeopleForm {
    name: string;
    surname: string;
    alias: string;
    email: string;
    gin: number;
    location: string;
    photo: {
        arraybuffer: ArrayBuffer;
        photoname: string;
    };
}
