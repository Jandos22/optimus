export interface UserData {
    name: string;
    surname: string;
    alias: string;
    email: string;
    gin: string;
    location: string;
    photo: {
        arraybuffer: ArrayBuffer;
        photoname: string;
    };
}
