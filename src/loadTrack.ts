import { TrackInfo, TrackCoord } from './gameModel'

export const parseTrack = (track: string[]): TrackInfo => {
    var startCoords;
    // heading from 90* left for ease of calc
    var startHeading = -1;
    const finishCoords: TrackCoord[] = [];

    const backgrounds: TrackCoord[] = [];
    const trackCoords: TrackCoord[] = [];

    track.forEach((line, y) => {
        line.split('').forEach((char, x) => {
            switch(char) {
                case '0':
                    backgrounds.push({x: x, y: y})
                    break;
                case 'r':
                    startHeading = 0
                    startCoords = {x: x, y: y}
                    break
                case 'd': 
                    startHeading = 1          
                    startCoords = {x: x, y: y}
                    break;
                case 'l':
                    startHeading = 2
                    startCoords = {x: x, y: y}
                    break;
                case 'u':
                    startHeading = 3
                    startCoords = {x: x, y: y}
                    break;
                case 'f':
                    finishCoords.push({x: x, y: y})
                    break;;
                case '1':
                    trackCoords.push({x: x, y: y})
                    break;
                default:
                    break;
            }
        })
    })

    console.log(startHeading)

    return {
        backgrounds: backgrounds,
        trackCoords: trackCoords,
        startCoords: startCoords,
        startAngle: startHeading * (Math.PI / 2),
        asString: track,
        trackInterval: 200,
        finishCoords: finishCoords
    };    
}

export const test1 = [
    '00000000000000000000000',
    '011111f1110001111100000',
    '011111f1111001101100000',
    '01100000011111101100000',
    '01100111100000001111110',
    '01100111110000000001110',
    '01111110111111110001110',
    '01111l10011111111111100',
    '01100000000000000011000',
    '01100000000011110110000',
    '01100000000010010011000',
    '01100000000010010001100',
    '01100000000110110000110',
    '01111111111110111111110',
    '00000000000000000000000',
]
export const v2test = [
    [2, 49, 8, 9, 9],
    [49, 7, 1, 1, 1],
    [53, 1, 45, 23, 23],
    [50, 43, 1, 1, 1],
    [2, 4, 20, 21, 21]
]

export const testTrack01 = [
[2,	2,	2,	2,	2,	2,	49,	54,	54,	50,	2],
[2,	2,	2,	2,	2,	49,	7,	1,	1,	19,	50],
[2,	49,	8,	7,	8,	8,	53,	21,	34,	1,	56],
[49,	7,	1,	1,	1,	31,	51,	27,	25,	31,	2],
[53,	1,	45,	23,	23,	54,	54,	54,	46,	31,	2],
[50,	43,	1,	1,	1,	1,	1,	1,	31,	51,	2],
[2,	4,	20,	32,	32,	44,	55,	55,	51,	2,	2]
]