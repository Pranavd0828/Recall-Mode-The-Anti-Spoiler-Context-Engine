export { };

declare global {
    class ImageCapture {
        constructor(videoTrack: MediaStreamTrack);
        takePhoto(photoSettings?: any): Promise<Blob>;
        getPhotoCapabilities(): Promise<any>;
        getPhotoSettings(): Promise<any>;
        grabFrame(): Promise<ImageBitmap>;
        track: MediaStreamTrack;
    }
}
