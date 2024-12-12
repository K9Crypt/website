declare module 'k9crypt' {
    class K9Crypt {
        constructor(secretKey: string);
        encrypt(data: string): Promise<string>;
        decrypt(data: string): Promise<string>;
    }
    export default K9Crypt;
}