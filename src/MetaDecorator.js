import _ from 'lodash'


export default class MetaDecorator {

    _decoratedClasses = []

    types(...types) {
        return this._makeDecorator((meta) => {
            meta.constructor.types.push(...types)
        })
    }

    singleton() {
        return this._makeDecorator((meta) => {
            meta.useAsSingleton = true
        })
    }

    _makeDecorator(populateMeta) {
        return (Class) => {
            populateMeta(this._getOrCreateMeta(Class))
        }
    }

    _getOrCreateMeta(Class) {
        if (!this._hasBeenAlreadyDecorated(Class)) {
            if (Class.__cubekitMeta__) {
                /**
                 * If the class hasn't been decorated yet, but has a
                 * meta property, than it was copied from its parent
                 * class. In this case we must clone it to prevent
                 * the parent meta from mutating by children.
                 *
                 * In the previous version we used `hasOwnProperty('__cubekitMeta__')`
                 * to determine was the property received from the
                 * parent class or created by another meta method
                 * on the current class, but it doesn't work when
                 * Babel is configured to support inheriting of
                 * static properties in old browsers.
                 */
                Class.__cubekitMeta__ = _.cloneDeep(Class.__cubekitMeta__)

                /**
                 * We don't want types from the parent class to merge
                 * with types of the child class. The child class must
                 * take care to pass right things into the parent constructor.
                 */
                Class.__cubekitMeta__.constructor.types = []
            } else {
                Class.__cubekitMeta__ = this._createDefaultMeta()
            }

            this._markAsDecorated(Class)
        }

        return Class.__cubekitMeta__
    }

    _hasBeenAlreadyDecorated(Class) {
        return this._decoratedClasses.indexOf(Class) != -1
    }

    _markAsDecorated(Class) {
        this._decoratedClasses.push(Class)
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