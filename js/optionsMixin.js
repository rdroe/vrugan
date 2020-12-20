
class DontResetImmutable extends Error {
    constructor(...args) { super(...args) }
}

class MissingArgument extends Error {
    constructor(...args) { super(...args) }
}
class NamespaceIsMissing extends Error {
    constructor(...args) { super(...args) }
}

class UndefinedProperty extends Error {
    constructor(...args) { super(...args) }
}

export default (thisChild) => ({

    setOptOnce: (...args) => {
        return thisChild._setOpt(args, true)
    },

    setOpt: (...args) => {
        return thisChild._setOpt(args, false)
    },

    _setOpt: ([arg1, arg2, arg3], requireMatch = false) => {

        if (arg2 === undefined) throw new MissingArgument()

        const ch = thisChild
        const opts = ch.opts

        if (arg3 === undefined) {
            const [key, val] = [arg1, arg2]
            if (opts.has(key)) {
                if (requireMatch && opts.get(key) !== val) throw new DontResetImmutable()
            }
            opts.set(key, val)
            return ch
        } else {

            const [namespace, key, val] = [arg1, arg2, arg3]
            if (!opts.has(namespace)) {
                opts.set(namespace, new Map)
            }

            const nsMap = opts.get(namespace)
            if (nsMap.has(key)) {
                if (requireMatch && nsMap.get(key) !== val) throw new DontResetImmutable()
            }
            nsMap.set(key, val)
            return ch
        }
    },
    getOpt: (arg1, arg2) => {
        const ch = thisChild
        const opts = ch.opts
        if (arg2 === undefined) return opts.get(arg1)
        if (!opts.has(arg1)) {
            throw new NamespaceIsMissing()
        }
        const ns = opts.get(arg1)
        if (!ns.has(arg2)) {
            throw new UndefinedProperty()
        }
        return ns.get(arg2)
    },
})
