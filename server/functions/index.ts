import {mouse} from '@nut-tree-fork/nut-js'

async function clickAt(x:any, y:any) {
    await mouse.setPosition({ x, y })
}

clickAt(500, 300)
