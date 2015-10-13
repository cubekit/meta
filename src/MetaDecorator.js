import _ from 'lodash'


export default class MetaDecorator {

    types(...types) {
        return this._makeDecorator(meta => {
            meta.constructor.types.push(...types)
        })
    }

    singleton() {
        return this._makeDecorator(meta => {
            meta.useAsSingleton = true
        })
    }

    _makeDecorator(populateMeta) {
        return (Class) => {
            populateMeta(this._getOrCreateMeta(Class))
        }
    }

    _getOrCreateMeta(Class) {
        if (!Class.__cubekitMeta__) {
            Class.__cubekitMeta__ = this._createDefaultMeta()
        } else if (!Class.hasOwnProperty('__cubekitMeta__')) {
            Class.__cubekitMeta__ = _.cloneDeep(Class.__cubekitMeta__)
        }

        return Class.__cubekitMeta__
    }

    _createDefaultMeta() {
        return {
            useAsSingleton: false,
            constructor: {
                types: [],
            }
        }
    }
}