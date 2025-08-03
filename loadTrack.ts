// coords on 50 px grid 
export interface TrackCoord {
    x: number,
    y: number
}

export interface TrackInfo {
    backgrounds: TrackCoord[]
    trackCoords: TrackCoord[],
    startCoords?: TrackCoord,
    asString: string[]
}

const characters = [
    '0', // oob 
    '1', // track
    's' // start
]

export const parseTrack = (track: string[]): TrackInfo => {
    var startCoords;
    const backgrounds: TrackCoord[] = [];
    const trackCoords: TrackCoord[] = [];

    track.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            switch(char) {
                case '0':
                    backgrounds.push({x: x, y: y})
                    break;
                case 's':
                    startCoords = {x: x, y: y}
                case '1':
                    trackCoords.push({x: x, y: y})
                    break;
                default:
                    break;
            }
        })
    })

    return {
        backgrounds: backgrounds,
        trackCoords: trackCoords,
        startCoords: startCoords,
        asString: track
    };    
}

export const test1 = [
    '0000000000000000000',
    '0111111111111000000',
    '0111111111111111110',
    '0110000000111111110',
    '0s10011110000000110',
    '0110011111000000110',
    '0111111011111111110',
    '0111111001111111100',
    '0000000000000000000'
]