// --- Part Two ---
// Now that you have the structure of your transmission decoded, you can calculate the value
// of the expression it represents.

// Literal values (type ID 4) represent a single number as described above. The remaining type
// IDs are more interesting:

// Packets with type ID 0 are sum packets - their value is the sum of the values of their
// sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.

// Packets with type ID 1 are product packets - their value is the result of multiplying together
// the values of their sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.

// Packets with type ID 2 are minimum packets - their value is the minimum of the values of their sub-packets.

// Packets with type ID 3 are maximum packets - their value is the maximum of the values of their sub-packets.

// Packets with type ID 5 are greater than packets - their value is 1 if the value of the first sub-packet is
// greater than the value of the second sub-packet; otherwise, their value is 0. These packets always have
// exactly two sub-packets.

// Packets with type ID 6 are less than packets - their value is 1 if the value of the first sub-packet is
// less than the value of the second sub-packet; otherwise, their value is 0. These packets always have
// exactly two sub-packets.

// Packets with type ID 7 are equal to packets - their value is 1 if the value of the first sub-packet
// is equal to the value of the second sub-packet; otherwise, their value is 0. These packets always have
// exactly two sub-packets.

// Using these rules, you can now work out the value of the outermost packet in your BITS transmission.

// For example:

// C200B40A82 finds the sum of 1 and 2, resulting in the value 3.
// 04005AC33890 finds the product of 6 and 9, resulting in the value 54.
// 880086C3E88112 finds the minimum of 7, 8, and 9, resulting in the value 7.
// CE00C43D881120 finds the maximum of 7, 8, and 9, resulting in the value 9.
// D8005AC2A8F0 produces 1, because 5 is less than 15.
// F600BC2D8F produces 0, because 5 is not greater than 15.
// 9C005AC2F8F0 produces 0, because 5 is not equal to 15.
// 9C0141080250320F1802104A08 produces 1, because 1 + 3 = 2 * 2.

// What do you get if you evaluate the expression represented by your hexadecimal-encoded BITS transmission?

import { readFileSync } from 'fs';
import { exit } from 'process';

const file = readFileSync('./16.input', 'utf-8');

const lines = file.split('\n');

let value = 0;
let leftovers = '';

for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 0) { continue; }

    [value, leftovers] = decodePacket(hexToBinary(lines[i]));
}

console.log(value);


// Packets with type ID 4 represent a literal value. Literal value packets encode a single binary
// number. To do this, the binary number is padded with leading zeroes until its length is a multiple
// of four bits, and then it is broken into groups of four bits. Each group is prefixed by a 1 bit
// except the last group, which is prefixed by a 0 bit. These groups of five bits immediately follow
// the packet header.
function decodeLiteralValue(packet: string): [number, string] {
    // console.log(`  found literal value`);
    let group = packet.slice(0, 5);
    packet = packet.slice(5);

    let value = '';
    while (true) {
        const groupPrefix = group[0];
        const groupValue = group.slice(1);
        value += groupValue;
        if (groupPrefix === '1') {
            group = packet.slice(0, 5);
            packet = packet.slice(5);
        } else if (groupPrefix === '0') {
            break;
        }
    }

    // console.log(`  returning [${parseInt(value, 2)}, ${packet}]`)

    return [parseInt(value, 2), packet];
}


// An operator packet contains one or more packets. To indicate which subsequent binary data represents
// its sub-packets, an operator packet can use one of two modes indicated by the bit immediately after
// the packet header; this is called the length type ID:
function decodeSubPackets(packet: string): [number[], string] {
    const lengthTypeId = packet.slice(0, 1);
    packet = packet.slice(1);

    // console.log(`  found length type ${lengthTypeId}`);

    let values: number[] = new Array();

    // If the length type ID is 0, then the next 15 bits are a number that represents the total length in
    // bits of the sub-packets contained by this packet.
    if (lengthTypeId === '0') {
        // console.log(`  total length in binary: ${packet.slice(0, 15)}`);
        let totalLength = parseInt(packet.slice(0, 15), 2);
        packet = packet.slice(15);
        // console.log(`  total length: ${totalLength}`);

        while (totalLength > 0) {
            const originalLength = packet.length;
            let [subValue, leftovers] = decodePacket(packet);
            totalLength -= (originalLength - leftovers.length);
            values.push(subValue);
            packet = leftovers;
        }
    }

    // If the length type ID is 1, then the next 11 bits are a number that represents the number of
    // sub-packets immediately contained by this packet.
    else if (lengthTypeId === '1') {
        let numberOfSubPackets = parseInt(packet.slice(0, 11), 2);
        packet = packet.slice(11);
        // console.log(`  number of sub-packets: ${numberOfSubPackets}`);

        while (numberOfSubPackets > 0) {
            let [subValue, leftovers] = decodePacket(packet);
            values.push(subValue);
            packet = leftovers;
            numberOfSubPackets -= 1;
        }
    }

    return [values, packet];
}


function decodePacket(packet: string): [number, string] {
    // console.log(`decoding ${packet}`);

    const version = parseInt(packet.slice(0, 3), 2);
    packet = packet.slice(3);

    const typeId = parseInt(packet.slice(0, 3), 2);
    packet = packet.slice(3);

    // console.log(`  version: ${version}, typeId: ${typeId}`);

    let value = 0;

    switch (typeId) {
        // Packets with type ID 0 are sum packets - their value is the sum of the values of their
        // sub-packets. If they only have a single sub-packet, their value is the value of the sub-packet.
        case 0: {
            let [values, leftovers] = decodeSubPackets(packet);
            value = values.reduce((a,b) => a + b, 0);
            packet = leftovers;
            break;
        }

        // Packets with type ID 1 are product packets - their value is the result of multiplying together
        // the values of their sub-packets. If they only have a single sub-packet, their value is the value
        // of the sub-packet.
        case 1: {
            let [values, leftovers] = decodeSubPackets(packet);
            value = values.reduce((a,b) => a * b, 1);
            packet = leftovers;
            break;
        }

        // Packets with type ID 2 are minimum packets - their value is the minimum of the values of their sub-packets.
        case 2: {
            let [values, leftovers] = decodeSubPackets(packet);
            value = Math.min(...values);
            packet = leftovers;
            break;
        }

        // Packets with type ID 3 are maximum packets - their value is the maximum of the values of their sub-packets.
        case 3: {
            let [values, leftovers] = decodeSubPackets(packet);
            value = Math.max(...values);
            packet = leftovers;
            break;
        }

        case 4: {
            let [subValue, leftovers] = decodeLiteralValue(packet);
            value = subValue;
            packet = leftovers;
            break;
        }

        // Packets with type ID 5 are greater than packets - their value is 1 if the value of the first sub-packet is
        // greater than the value of the second sub-packet; otherwise, their value is 0. These packets always have
        // exactly two sub-packets.
        case 5: {
            let [values, leftovers] = decodeSubPackets(packet);
            value = values[0] > values[1] ? 1 : 0;
            packet = leftovers;
            break;
        }

        // Packets with type ID 6 are less than packets - their value is 1 if the value of the first sub-packet is
        // less than the value of the second sub-packet; otherwise, their value is 0. These packets always have
        // exactly two sub-packets.
        case 6: {
            let [values, leftovers] = decodeSubPackets(packet);
            value = values[0] < values[1] ? 1 : 0;
            packet = leftovers;
            break;
        }

        // Packets with type ID 7 are equal to packets - their value is 1 if the value of the first sub-packet
        // is equal to the value of the second sub-packet; otherwise, their value is 0. These packets always have
        // exactly two sub-packets.
        case 7: {
            let [values, leftovers] = decodeSubPackets(packet);
            value = values[0] === values[1] ? 1 : 0;
            packet = leftovers;
            break;
        }
    }

    // console.log(`returning [${value}, ${packet}]`)
    return [value, packet];
}


function hexToBinary(message: string): string {
    let binaryString = '';
    for (let i = 0; i < message.length; i++) {
        switch (message[i]) {
            case '0': binaryString += '0000'; break;
            case '1': binaryString += '0001'; break;
            case '2': binaryString += '0010'; break;
            case '3': binaryString += '0011'; break;
            case '4': binaryString += '0100'; break;
            case '5': binaryString += '0101'; break;
            case '6': binaryString += '0110'; break;
            case '7': binaryString += '0111'; break;
            case '8': binaryString += '1000'; break;
            case '9': binaryString += '1001'; break;
            case 'A': binaryString += '1010'; break;
            case 'B': binaryString += '1011'; break;
            case 'C': binaryString += '1100'; break;
            case 'D': binaryString += '1101'; break;
            case 'E': binaryString += '1110'; break;
            case 'F': binaryString += '1111'; break;
        }
    }

    return binaryString;
}
