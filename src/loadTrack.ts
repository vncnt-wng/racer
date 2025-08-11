import { TrackInfo, TrackCoord } from './gameModel'

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
        startAngle: - Math.PI / 2,
        asString: track,
        trackInterval: 200
    };    
}

export const test1 = [
    '00000000000000000000000',
    '01111111110001111100000',
    '01111111111001101100000',
    '01100000011111101100000',
    '0s100111100000001111110',
    '01100111110000000001110',
    '01111110111111110001110',
    '01111110011111111111100',
    '00000000000000000000000'
]