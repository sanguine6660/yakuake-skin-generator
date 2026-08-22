export const createTarHeader = (filename: string, size: number): Uint8Array => {
    const header = new Uint8Array(512)
    const encoder = new TextEncoder()

    header.set(encoder.encode(filename), 0)
    header.set(encoder.encode('0000644\0'), 100)
    header.set(encoder.encode('0000765\0'), 108)
    header.set(encoder.encode('0000765\0'), 116)
    const sizeOctal = size.toString(8).padStart(11, '0') + '\0'
    header.set(encoder.encode(sizeOctal), 124)
    const mtimeOctal =
        Math.floor(Date.now() / 1000)
            .toString(8)
            .padStart(11, '0') + '\0'
    header.set(encoder.encode(mtimeOctal), 136)
    header[156] = 48
    header.set(encoder.encode('ustar\0'), 257)
    header.set(encoder.encode('00'), 263)

    let checksum = 0
    for (let i = 0; i < 512; i++) {
        checksum += i >= 148 && i < 156 ? 32 : header[i]
    }
    const checkString = checksum.toString(8).padStart(6, '0') + '\0 '
    header.set(encoder.encode(checkString), 148)

    return header
}

export const createTarGz = async (
    files: { path: string; content: Uint8Array }[],
    outputName: string
): Promise<void> => {
    const chunks: Uint8Array[] = []
    for (const f of files) {
        const header = createTarHeader(f.path, f.content.length)
        chunks.push(header)
        chunks.push(f.content)
        const remainder = f.content.length % 512
        if (remainder > 0) chunks.push(new Uint8Array(512 - remainder))
    }
    chunks.push(new Uint8Array(1024))

    const totalLength = chunks.reduce((acc, c) => acc + c.length, 0)
    const tarBytes = new Uint8Array(totalLength)
    let offset = 0
    for (const chunk of chunks) {
        tarBytes.set(chunk, offset)
        offset += chunk.length
    }

    const stream = new Response(tarBytes).body?.pipeThrough(new CompressionStream('gzip'))
    if (!stream) return
    const compressedResponse = await new Response(stream).blob()
    const url = URL.createObjectURL(compressedResponse)
    const a = document.createElement('a')
    a.href = url
    a.download = outputName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
}

export const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    const cleanHex = hex.replace('#', '')
    const r = parseInt(cleanHex.substring(0, 2), 16) || 0
    const g = parseInt(cleanHex.substring(2, 4), 16) || 0
    const b = parseInt(cleanHex.substring(4, 6), 16) || 0
    return { r, g, b }
}

export const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export const rgbToString = (color: { r: number; g: number; b: number }): string => {
    return `${color.r},${color.g},${color.b}`
}
