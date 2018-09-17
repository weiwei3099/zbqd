const system = () => {
    let client = {}
    // window.addEventListener('resize', (e)=>{
    //     client.width = e.target.innerWidth
    //     client.height = e.target.innerHeight
    // })
    return {
        width: document.body.clientWidth,
        height: document.body.clientHeight,
    }
}

export default {
    state: {
        system: system()
    },
    mutations: {

    },
    actions: {

    }
}
