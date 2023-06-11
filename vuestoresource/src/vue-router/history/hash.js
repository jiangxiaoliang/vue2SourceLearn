import { History } from "./base";

function getHash() {
    return window.location.hash.slice(1)
}

class HashHistory extends History {
    constructor(router) {
        super(router)
        this.router = router
        ensureSlash()
    }

    getCurrentLocation() {
        return getHash()
    }

    setupListener() {
        window.addEventListener('hashchange', () => {
            this.transitionTo(getHash())
        })
    }
}

function ensureSlash() {
    if (window.location.hash) {
        return
    }
    window.location.hash = '#/'
}

export {
    HashHistory
}