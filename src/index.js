import {
  has,
  prop,
  assoc,
  dissoc
} from '@nuware/functions'

import Store from '@nuware/store'
import ID from '@nuware/id'

const Actors = () => {
  let actors = {}
  const store = Store()

  const lookup = (name) => {
    if (has(name)(actors)) return prop(name)(actors)
    throw new Error(`Actor with name: ${name}, not exists`)
  }

  const hookup = (name, actor = {}) => {
    if (has(name)(actors)) throw new Error(`Actor with name: ${name}, already exists`)
    const messages = store.ref(name)

    messages.remove()

    const handler = ({
      key,
      value
    }) => {
      lookup(name).onMessage(value)
      messages.child(key).remove()
    }

    actor = Object.assign({
      init: () => Promise.resolve(),
      onMessage: () => {
        throw new Error(`onMessage not implemented for Actor: ${name}`)
      }
    }, actor)

    Object.defineProperty(actor, 'name', {
      value: name,
      writable: false
    })

    Object.defineProperty(actor, 'send', {
      value: (data) => {
        messages.child(ID()).set(data)
      },
      writable: false
    })

    Object.defineProperty(actor, 'destroy', {
      value: () => {
        messages.off(Store.CHILD_ADDED_EVENT, handler)
        messages.remove()
        actors = dissoc(name)(actors)
      },
      writable: false
    })

    actors = assoc(name)(actor)(actors)

    return Promise.resolve(actor.init()).then(() => {
      return messages.on(Store.CHILD_ADDED_EVENT, handler)
    })
  }

  return {
    hookup,
    lookup
  }
}

export default Actors()
