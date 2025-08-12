import { TileStore, TrackInfo } from './gameModel'


export const load = async (): Promise<TileStore> => {
    const img = await loadImage('./static/racerTiles.bmp');
    const tileStore = await sliceTiles(img, 32);
    return tileStore;
}


const sliceTiles = async (tileset: HTMLImageElement, tileSize: number): Promise<TileStore> => {
    const cols = tileset.width / tileSize;
	const rows = tileset.height / tileSize;
	const tiles: ImageBitmap[] = [];
	for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            const tileCanvas = document.createElement('canvas');
            tileCanvas.width = tileSize;
            tileCanvas.height = tileSize;
            const bitmap = await createImageBitmap(
                tileset,
                x * tileSize, y * tileSize, tileSize, tileSize
            );
            tiles.push(bitmap);
        }
	}
    return { tiles:tiles };
}

const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => resolve(img);
        img.onerror = reject;
    });
}