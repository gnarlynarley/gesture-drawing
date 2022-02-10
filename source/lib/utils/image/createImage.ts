export default function createImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = document.createElement("img");
    image.onload = () => {
      resolve(image);
    };
    image.onerror = () => {
      reject(new Error("Something went wrong loading the src"));
    };
    image.src = src;
  });
}
